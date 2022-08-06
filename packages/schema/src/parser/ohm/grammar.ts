import * as ohmSynth from 'ohm-js';
import { Config } from '../../runtimeConfig.js';

const ohm: typeof ohmSynth = (ohmSynth as any).default;

const grammarDefinition = String.raw`
  Main
  	= PropertyList Entities
  
  PropertyList
  	= PropertyList Property -- list
    | "" -- empty
  
  Property
  	= propertyKey name -- primitive
    | propertyKey "{" PropertyList "}" -- complex
  
  propertyKey
  	= name ":"
  
  name
  	= alnum+
    
  Entities
  	= Entities Node -- node
    | Entities Edge -- edge
    | Entities NodeTrait -- trait
    | "" -- empty
  
  Node
  	= name "as" ("Node" | "UnmanagedNode") NodeFields NodeFunctions
  
  Edge
  	= name "as" "Edge" "<" name "," name ">" NodeFields EdgeFunctions
  
  NodeFields
  	= "{" FieldDeclarations "}"
  
  NodeTrait
  	= name "as" "NodeTrait" NodeFields NodeFunctions
  
  FieldDeclarations
  	= FieldDeclarations FieldDeclaration -- list
    | "" -- empty
  
  FieldDeclaration
  	= FieldNum propertyKey TypeExpression
  
  FieldNum
    = digit*
  
  FieldType
  	= NonCompositeFieldType | CompositeFieldType
  
  NonCompositeFieldType
  	= IdField
    | NaturalLanguageField
    | EnumField
    | TimeField
    | PrimitiveField
    | BitmaskField
  
  CompositeFieldType
  	= ArrayField
    | MapField
  
  IdField
  	= "ID" "<" name ">"
  
  NaturalLanguageField
  	= "NaturalLanguage"
  
  EnumField
  	= "Enumeration" "<" EnumKeys ">"
  
  EnumKeys
  	= EnumKeys "|" name -- list
    | name -- key
    
  BitmaskField
  	= "Bitmask" "<" EnumKeys ">"
  
  TimeField
  	= "Timestamp"
  
  PrimitiveField
  	= "bool"
    | "int32"
    | "int64"
    | "float32"
    | "float64"
    | "uint32"
    | "uint64"
    | "string"
    | "null"
    | "any"
  
  ArrayField
  	= "Array" "<" (FieldType | name) ">"
  
  MapField
  	= "Map" "<" NonCompositeFieldType "," FieldType ">"
  
  NodeFunctions
  	= NodeFunctions "&" NodeFunction -- list
    | "" -- empty
  
  EdgeFunctions
  	= EdgeFunctions "&" EdgeFunction -- list
    | "" -- empty
  
  EdgeFunction
  	= IndexFn
    | InvertFn
    // ExtensionPoint:EdgeFunction
  
  NodeFunction
  	= OutboundEdgesFn
    | InboundEdgesFn
    | IndexFn
    | ReadPrivacyFn
    | TraitsFn
    // ExtensionPoint:NodeFunction
  
  OutboundEdgesFn
  	= "OutboundEdges" "{" EdgeDeclarations "}"
  
  InboundEdgesFn
  	= "InboundEdges" "{" EdgeDeclarations "}"
  
  IndexFn
  	= "Index" "{" Indices "}"
  
  InvertFn
  	= "Invert" "as" name
  
  ReadPrivacyFn
  	= "ReadPrivacy" "{" "}"
  
  TraitsFn
  	= "Traits" "{" NameList "}"
  
  EdgeDeclarations
  	= EdgeDeclarations EdgeDeclaration -- list
    | "" -- empty
  
  EdgeDeclaration
  	= propertyKey InlineEdgeDefinition -- inline
    | propertyKey name -- reference

  InlineEdgeDefinition
    = "Edge" "<" NameOrResolution ">"
  
  NameOrResolution
  	= name "." name -- resolution
    | name -- name
  
  Indices
  	= Indices IndexDeclaration -- list
    | "" -- empty
  
  IndexDeclaration
  	= propertyKey Index -- fullDef
    | name -- shortDef
  
  Index
    = UniqueIndex
    | NonUniqueIndex
  
  UniqueIndex
    = "unique" "(" CommaNameList ")"

  NonUniqueIndex
    = CommaNameList
  
  CommaNameList
    = CommaNameList "," name -- list
    | name -- name
  
  NameList
  	= NameList name -- list
    | name -- name
  
  TypeExpression
  	= TypeExpression "|" TypeName -- union
    | TypeExpression "&" TypeName -- intersection
    | TypeName -- single
  
  TypeName
    = FieldType
    | name
`;

export function compileGrammar(config: Config = {}) {
  let extendedGrammar = grammarDefinition;
  config.grammarExtensions?.forEach(e => {
    Object.entries(e.extends).forEach(([what, with_]) => {
      // ExtensionPoint:NodeFunction
      const marker = `// ExtensionPoint:${what}`;
      extendedGrammar = extendedGrammar.replaceAll(
        new RegExp(marker, 'g'),
        `| ${with_}\n${marker}`,
      );
    });

    extendedGrammar = extendedGrammar + '\n' + e.grammar();
  });

  const grammar = ohm.grammar(`Aphro { ${extendedGrammar} }`);
  return grammar;
}
