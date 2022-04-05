import * as ohm from "ohm-js";

const grammarDefinition = String.raw`
Aphro {
  Main
  	= PropertyList Entities
  
  PropertyList
  	= PropertyList Property -- list
    | "" -- empty
  
  Property
  	= propertyKey name
  
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
  	= name "as" "Node" NodeFields NodeFunctions
  
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
  	= propertyKey FieldType
  
  FieldType
  	= NonCompositeFieldType | CompositeFieldType
  
  NonCompositeFieldType
  	= IdField
    | NaturalLanguageField
    | EnumField
    | TimeField
    | CurrencyField
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
  
  CurrencyField
  	= "Currency" "<" name ">"
  
  PrimitiveField
  	= "bool"
    | "int32"
    | "int64"
    | "float32"
    | "float64"
    | "uint32"
    | "uint64"
    | "string"
  
  ArrayField
  	= "Array" "<" FieldType ">"
  
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
  
  NodeFunction
  	= OutboundEdgesFn
    | InboundEdgesFn
    | IndexFn
    | ReadPrivacyFn
    | TraitsFn
  
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
}
`;

const grammar = ohm.grammar(grammarDefinition);

export default grammar;
