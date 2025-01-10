import type { Parser } from "./loadParser";

export interface OptionTypeDeclaration {
  name: string;
  node: Parser.SyntaxNode;
}

function parseFuncType(node: Parser.SyntaxNode) {
  const parametersNode = node.childForFieldName("parameters");
  if (!parametersNode) {
    return;
  }

  const paramDecl = parametersNode.children.find(
    (i) => i.type === "parameter_declaration"
  );
  if (!paramDecl) {
    return;
  }

  const paramTypeNode = paramDecl.childForFieldName("type");
  if (paramTypeNode?.type !== "pointer_type") {
    return;
  }

  const baseTypeNode = paramTypeNode.children.find(
    (i) => i.type === "type_identifier"
  );
  if (!baseTypeNode) {
    return;
  }

  const typeName = baseTypeNode.text;
  return {
    typeName,
  };
}

export default function getOptionTypeNames(root: Parser.SyntaxNode) {
  const m = new Map<string, OptionTypeDeclaration>();

  for (const node of root.children) {
    if (node.type !== "type_declaration") {
      continue;
    }
    for (const decl of node.children) {
      if (!(decl.type === "type_spec" || decl.type === "type_alias")) {
        continue;
      }
      const nameNode = decl.childForFieldName("name");
      const typeNode = decl.childForFieldName("type");
      if (!nameNode || typeNode?.type !== "function_type") {
        continue;
      }
      const v = parseFuncType(typeNode);
      if (v) {
        m.set(v.typeName, {
          name: nameNode.text,
          node: decl,
        });
      }
    }
  }

  return m;
}
