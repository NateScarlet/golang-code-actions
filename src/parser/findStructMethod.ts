import type { Parser } from "./loadParser";

export interface MethodDefinition {
  name: string;
  receiver: string;
  node: Parser.SyntaxNode;
}

export default function* findStructMethod(
  root: Parser.SyntaxNode
): IterableIterator<MethodDefinition> {
  // 遍历根节点的所有子节点
  for (const node of root.children) {
    // 检查节点是否为函数声明
    if (node.type !== "func_declaration") {
      // 如果不是函数声明节点，跳过
      continue;
    }

    // 获取接收器节点
    const receiverNode = node.childForFieldName("receiver");
    if (!receiverNode) {
      // 如果没有接收器节点，跳过（不是方法）
      continue;
    }

    let receiverName = "";
    // 处理接收器节点类型
    if (receiverNode.type === "parameter_list") {
      // 查找参数声明节点
      const params = receiverNode.children.filter(
        (child) => child.type === "parameter_declaration"
      );
      if (params.length > 0) {
        const firstParam = params[0];
        const identNode = firstParam.childForFieldName("name");
        if (identNode) {
          receiverName = identNode.text;
        }
      }
    } else if (receiverNode.type === "type_specifier") {
      // 处理类型标识符节点
      const identNode = receiverNode.childForFieldName("name");
      if (identNode) {
        receiverName = identNode.text;
      }
    }

    // 获取方法名称节点
    const nameNode = node.childForFieldName("name");
    if (!nameNode) {
      // 如果没有方法名称节点，跳过
      continue;
    }
    const methodName = nameNode.text;

    // 返回方法定义信息
    yield {
      receiver: receiverName,
      name: methodName,
      node,
    };
  }
}
