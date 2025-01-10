import type { Parser } from "./loadParser";

export interface StructField {
  name: string;
  type: string;
  embeded: boolean;
  node: Parser.SyntaxNode;
  typeNode: Parser.SyntaxNode;
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

export default function* findStruct(
  tree: Parser.SyntaxNode
): IterableIterator<Struct> {
  // 遍历根节点的所有子节点
  for (const node of tree.children) {
    // 查找类型定义节点
    const typeSpecNode = node.children.find((i) => i.type === "type_spec");
    if (!typeSpecNode) {
      // 如果没有类型定义节点，跳过当前节点
      continue;
    }

    // 获取结构体名称
    const nameNode = typeSpecNode.childForFieldName("name");
    if (nameNode?.type !== "type_identifier") {
      // 如果名称节点不是类型标识符，跳过当前节点
      continue;
    }
    const structName = nameNode.text;

    // 获取结构体类型节点
    const structTypeNode = typeSpecNode.childForFieldName("type");
    if (structTypeNode?.type !== "struct_type") {
      // 如果类型节点不是结构体类型，跳过当前节点
      continue;
    }

    // 获取字段声明列表节点
    const fieldDeclarationListNode = structTypeNode.children.find(
      (i) => i.type === "field_declaration_list"
    );
    if (!fieldDeclarationListNode) {
      // 如果没有字段声明列表节点，跳过当前节点
      continue;
    }

    // 获取类型参数节点
    const typeParametersNode =
      typeSpecNode.childForFieldName("type_parameters");

    // 创建结构体对象
    const struct: Struct = {
      name: structName,
      typeParamDecl: typeParametersNode?.text ?? "",
      typeParams:
        typeParametersNode?.children
          .filter((i) => i.type === "type_parameter_declaration")
          .map((i): StructTypeParam => {
            const nameNode = i.childForFieldName("name");
            const typeNode = i.childForFieldName("type");
            return {
              name: nameNode?.text ?? "",
              type: typeNode?.text ?? "",
              node: i,
            };
          }) ?? [],
      fields: [],
      node,
    };

    // 遍历所有字段声明节点
    fieldDeclarationListNode.children.forEach((fieldDeclarationNode) => {
      if (fieldDeclarationNode.type !== "field_declaration") {
        // 如果节点不是字段声明节点，跳过
        return;
      }

      const typeNode = fieldDeclarationNode.childForFieldName("type");
      if (!typeNode) {
        // 如果没有类型节点，跳过
        return;
      }

      // 查找所有字段标识符节点
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
          typeNode,
        });
      });

      // 处理嵌入结构体（没有字段名的情况）
      if (fieldNameNodes.length === 0) {
        struct.fields.push({
          name: typeNode.text,
          type: typeNode.text,
          node: typeNode,
          typeNode,
          embeded: true,
        });
      }
    });

    // 返回当前结构体
    yield struct;
  }
}
