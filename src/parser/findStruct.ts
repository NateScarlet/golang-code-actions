import type { Parser } from "./loadParser";
import loadParser from "./loadParser";

export interface StructField {
  name: string;
  type: string;
  embeded: boolean;
  node: Parser.SyntaxNode;
}

export interface StructTypeParam {
  name: string;
  type: string;
  node: Parser.SyntaxNode;
}

export interface Struct {
  name: string;
  typeParamDecl: string;
  typeParams: StructTypeParam[];
  fields: StructField[];
  node: Parser.SyntaxNode;
}

export default async function* findStruct(
  input: string
): AsyncIterableIterator<Struct> {
  const parser = await loadParser();
  const tree = parser.parse(input);

  // 参考文档：https://github.com/tree-sitter/tree-sitter-go/blob/master/grammar.js

  // 遍历根节点的所有子节点
  for (const node of tree.rootNode.children) {
    const typeSpecNode = node.children.find((i) => i.type === "type_spec");
    if (!typeSpecNode) {
      continue;
    }

    // 获取结构体名称
    const nameNode = typeSpecNode.childForFieldName("name");
    if (nameNode?.type !== "type_identifier") {
      continue;
    }
    const structName = nameNode.text;

    // 获取结构体类型节点
    const structTypeNode = typeSpecNode.childForFieldName("type");
    if (structTypeNode?.type !== "struct_type") {
      continue;
    }
    // 获取字段声明列表节点
    const fieldDeclarationListNode = structTypeNode.children.find(
      (i) => i.type === "field_declaration_list"
    );
    if (!fieldDeclarationListNode) {
      continue;
    }

    // 类型参数
    const typeParametersNode =
      typeSpecNode?.childForFieldName("type_parameters");

    // 创建结构体对象
    const struct: Struct = {
      name: structName,
      typeParamDecl: typeParametersNode?.text ?? "",
      typeParams:
        typeParametersNode?.children
          .filter((i) => i.type === "type_parameter_declaration")
          .map((i): StructTypeParam => {
            return {
              name: i.childForFieldName("name")?.text ?? "",
              type: i.childForFieldName("type")?.text ?? "",
              node: i,
            };
          }) ?? [],
      fields: [],
      node,
    };

    // 遍历所有字段声明节点
    fieldDeclarationListNode.children.forEach((fieldDeclarationNode) => {
      if (fieldDeclarationNode.type !== "field_declaration") {
        return;
      }

      const typeNode = fieldDeclarationNode.childForFieldName("type");
      if (!typeNode) {
        return;
      }

      const fieldNameNodes = fieldDeclarationNode.children.filter(
        (child) => child.type === "field_identifier"
      );
      // 遍历所有字段名，添加到结构体字段列表
      fieldNameNodes.forEach((fieldNameNode) => {
        const fieldName = fieldNameNode.text;
        struct.fields.push({
          name: fieldName,
          type: typeNode.text,
          node: fieldNameNode,
          embeded: false,
        });
      });
      // 嵌入结构体没有字段名
      if (fieldNameNodes.length === 0) {
        struct.fields.push({
          name: typeNode.text,
          type: typeNode.text,
          node: typeNode,
          embeded: true,
        });
      }
    });

    // 返回一个
    yield struct;
  }
}
