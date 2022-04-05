import { ID, Import, Node } from "../parser/SchemaType.js";

const inboundEdges = {
  isForeignKeyEdge() {},

  isFieldEdge() {},

  isJunctionEdge() {},
};

const outboundEdges = {
  isForeignKeyEdge() {},

  isFieldEdge() {},

  isJunctionEdge() {},
};

const fields = {};

export default {
  allEdges(node: Node) {
    const inboundEdges = Object.values(
      node.extensions.inboundEdges?.edges || {}
    );
    const outboundEdges = Object.values(
      node.extensions.outboundEdges?.edges || {}
    );

    return [...inboundEdges, ...outboundEdges];
  },

  queryTypeName(nodeName: string): string {
    return nodeName + "Query";
  },

  addModuleImport(node: Node, imp: Import) {
    const module = (node.extensions.module = node.extensions.module || {
      name: "moduleConfig",
      imports: new Map(),
    });

    module.imports.set(JSON.stringify(imp), imp);
  },

  decorateType(node: Node, decoration: string) {
    const typeConfig = node.extensions.type || {
      name: "typeConfig",
      decorators: [],
    };

    typeConfig.decorators?.push(decoration);
  },
};
