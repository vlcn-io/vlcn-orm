import { compileGrammar } from './ohm/grammar.js';
import * as fs from 'fs';
import { SchemaFileAst } from '@aphro/schema-api';
import { Config } from '../runtimeConfig.js';
import { ActionDict, Node } from 'ohm-js';

const list = (l: Node, r: Node) => l.toAst().concat(r.toAst());
const listInit = (_: Node) => [];
const listWithSeparator = (l: Node, _: Node, r: Node) => list(l, r);

function stripComments(s: string): string {
  return s.replaceAll(/#[^\n]*/g, '');
}

export function createParser(config: Config = {}) {
  const grammar = compileGrammar(config);
  const semantics = grammar.createSemantics();
  semantics.addOperation('toAst', {
    Main(preamble, entities) {
      return {
        preamble: preamble
          .toAst()
          .reduce((l: { [key: string]: any }, r: { key: string; value: any }) => {
            l[r.key] = r.value;
            return l;
          }, {}),
        entities: entities.toAst(),
      };
    },
    _iter(...children) {
      return children.map(c => c.toAst());
    },
    PropertyList_list: list,
    PropertyList_empty(_) {
      return [];
    },
    Property_primitive(key, name) {
      return [{ key: key.toAst(), value: name.toAst() }];
    },
    Property_complex(key, _, list, __) {
      const value = list
        .toAst()
        .reduce((l: { [key: string]: any }, r: { key: string; value: any }) => {
          l[r.key] = r.value;
          return l;
        }, {});
      return [{ key: key.toAst(), value }];
    },
    propertyKey(key, _colon) {
      return key.toAst();
    },
    name(name) {
      return name.sourceString;
    },
    Entities_node: list,
    Entities_edge: list,
    Entities_trait: list,
    Entities_empty: listInit,
    Node(name, _as, shorthand, fields, functions) {
      return {
        type: 'node',
        as: shorthand.sourceString,
        name: name.toAst(),
        fields: fields.toAst(),
        extensions: functions.toAst(),
      };
    },
    Edge(name, _as, _edge, _lAngle, src, _comma, dest, _rAngle, fields, extensions) {
      return {
        type: 'edge',
        src: {
          type: src.toAst(),
        },
        dest: {
          type: dest.toAst(),
        },
        name: name.toAst(),
        fields: fields.toAst() || [],
        extensions: extensions.toAst() || [],
      };
    },
    NodeFields(_lSquig, declarations, _rSquig) {
      return declarations.toAst();
    },
    NodeTrait(name, _as, _nodeTrait, nodeFields, extensions) {
      return {
        type: 'nodeTrait',
        name: name.toAst(),
        fields: nodeFields.toAst() || [],
        extensions: extensions.toAst() || [],
      };
    },
    FieldDeclarations_list: list,
    FieldDeclarations_empty: listInit,
    // Gross hack for optional types.
    // This hack is here because we're re-writing field types soon with the introduction of
    // semantic types.
    FieldDeclaration(num, key, type) {
      return {
        num: num.toAst(),
        name: key.toAst(),
        type: type.toAst(),
      };
    },
    FieldNum(num) {
      return num.sourceString || undefined;
    },
    FieldType(type) {
      return type.toAst();
    },
    NonCompositeFieldType(type) {
      return type.toAst();
    },
    CompositeFieldType(type) {
      return type.toAst();
    },
    IdField(_id, _langle, of, _rangle) {
      return {
        type: 'id',
        of: of.toAst(),
      };
    },
    NaturalLanguageField(_) {
      return {
        type: 'naturalLanguage',
      };
    },
    EnumField(_, _lAngle, keys, _rAngle) {
      return {
        type: 'enumeration',
        keys: keys.toAst(),
      };
    },
    EnumKeys_list: listWithSeparator,
    EnumKeys_key(key) {
      return [key.toAst()];
    },
    BitmaskField(_, _lAngle, keys, _rAngle) {
      return {
        type: 'bitmask',
        keys: keys.toAst(),
      };
    },
    TimeField(_) {
      return {
        type: 'timestamp',
      };
    },
    // CurrencyField(_, _lAngle, denomination, _rAngle) {
    //   return {
    //     type: 'currency',
    //     denomination: denomination.toAst(),
    //   };
    // },
    PrimitiveField(subtype) {
      return {
        type: 'primitive',
        subtype: subtype.sourceString,
      };
    },
    ArrayField(_, _lAngle, values, _rAngle) {
      return {
        type: 'array',
        values: values.toAst(),
      };
    },
    MapField(_, _lAngle, keys, _comma, values, _rAngle) {
      return {
        type: 'map',
        keys: keys.toAst(),
        values: values.toAst(),
      };
    },
    NodeFunctions_list: listWithSeparator,
    NodeFunctions_empty: listInit,
    NodeFunction(fn) {
      return fn.toAst();
    },
    EdgeFunctions_list: listWithSeparator,
    EdgeFunctions_empty: listInit,
    EdgeFunction(fn) {
      return fn.toAst();
    },
    OutboundEdgesFn(_, _lSquig, declarations, _rSquig) {
      return {
        name: 'outboundEdges',
        declarations: declarations.toAst(),
      };
    },
    InboundEdgesFn(_, _lSquig, declarations, _rSquig) {
      return {
        name: 'inboundEdges',
        declarations: declarations.toAst(),
      };
    },
    IndexFn(_, _lSquig, declarations, _rSquig) {
      return {
        name: 'index',
        declarations: declarations.toAst(),
      };
    },
    InvertFn(_, _as, name) {
      return {
        name: 'invert',
        as: name.toAst(),
      };
    },
    ReadPrivacyFn(_, _lSquig, _rSquig) {
      return {
        name: 'readPrivacy',
        declarations: [],
      };
    },
    TraitsFn(_, _lSquig, traits, _rSquig) {
      return {
        name: 'traits',
        declarations: traits.toAst(),
      };
    },
    EdgeDeclarations_list: list,
    EdgeDeclarations_empty: listInit,
    EdgeDeclaration_inline(key, definition) {
      return {
        name: key.toAst(),
        ...definition.toAst(),
      };
    },
    EdgeDeclaration_reference(key, name) {
      return {
        name: key.toAst(),
        type: 'edgeReference',
        reference: name.toAst(),
      };
    },
    InlineEdgeDefinition(_, _lAngle, throughOrTo, _rAngle) {
      return {
        type: 'edge',
        throughOrTo: throughOrTo.toAst(),
      };
    },
    NameOrResolution_resolution(type, _dot, field) {
      return {
        type: type.toAst(),
        column: field.toAst(),
      };
    },
    NameOrResolution_name(type) {
      return {
        type: type.toAst(),
      };
    },
    Indices_list: list,
    Indices_empty: listInit,
    IndexDeclaration_fullDef(key, index) {
      return {
        name: key.toAst(),
        ...index.toAst(),
      };
    },
    IndexDeclaration_shortDef(name) {
      return {
        name: name.toAst(),
        type: 'nonUnique',
        columns: [name.toAst()],
      };
    },
    UniqueIndex(_, _lParen, columns, _rParen) {
      return {
        type: 'unique',
        columns: columns.toAst(),
      };
    },
    NonUniqueIndex(columns) {
      return {
        type: 'nonUnique',
        columns: columns.toAst(),
      };
    },
    CommaNameList_list: listWithSeparator,
    CommaNameList_name(name) {
      return [name.toAst()];
    },
    NameList_list: list,
    NameList_name(name) {
      return [name.toAst()];
    },
    TypeExpression_union(list, _union, name) {
      return list.toAst().concat([
        {
          type: 'union',
        },
        name.toAst(),
      ]);
    },
    TypeExpression_intersection(list, _intersection, name) {
      return list.toAst().concat([
        {
          type: 'intersection',
        },
        name.toAst(),
      ]);
    },
    TypeExpression_single(name) {
      return [name.toAst()];
    },
    ...extendedSemantics(config),
  });

  function parse(filePath: string): SchemaFileAst {
    const schemaFileContents = fs.readFileSync(filePath, {
      encoding: 'utf8',
      flag: 'r',
    });

    return parseString(schemaFileContents);
  }

  function parseString(schemaFileContents: string): SchemaFileAst {
    schemaFileContents = stripComments(schemaFileContents);

    const matchResult = grammar.match(schemaFileContents);
    if (matchResult.failed()) {
      throw new Error(matchResult.message);
    }

    const adapter = semantics(matchResult);
    const ast = adapter.toAst();

    return ast as SchemaFileAst;
  }

  return {
    parse,
    parseString,
  };
}

function extendedSemantics<T>(config: Config): ActionDict<T> {
  const ret: ActionDict<T> = {};
  const extensions = config.grammarExtensions;
  if (extensions == null) {
    return {};
  }

  extensions.forEach(e => {
    Object.entries(e.actions()).forEach(([key, value]) => {
      if (ret[key]) {
        throw new Error(`Semantic action ${key} is being overriden by extension ${e.name}`);
      }
      // @ts-ignore -- TODO
      ret[key] = value;
    });
  });
  return ret;
}
