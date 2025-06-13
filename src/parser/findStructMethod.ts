// Parser 来自 web-tree-sitter
import type { Parser } from "./loadParser";

export interface MethodDefinition {
  /** 方法名称 */
  name: string;
  /** 接收者类型名称，不含指针符号和泛型参数。 */
  receiver: string;
  /** 是否为指针接收者。 */
  isPointerReceiver: boolean;
  /** 方法节点 */
  node: Parser.SyntaxNode;
}

function resolveTypeNode(node: Parser.SyntaxNode): {
  type: string;
  isPointer: boolean;
} {
  let currentNode: Parser.SyntaxNode | null = node;
  let isPointer = false;

  // eslint-disable-next-line no-constant-condition
  while (currentNode) {
    switch (currentNode.type) {
      case "pointer_type":
        isPointer = true;
        // 移动至指针指向的类型节点
        currentNode = currentNode.childForFieldName("element");
        break;
      case "parenthesized_type":
        // 进入括号内的类型
        currentNode = currentNode.firstNamedChild;
        break;
      case "array_type":
      case "slice_type":
      case "map_type":
        // 对于容器类型，获取其元素类型作为基类型
        currentNode = currentNode.childForFieldName("element");
        break;
      case "generic_type":
        // 获取泛型的基本类型
        currentNode = currentNode.childForFieldName("type");
        break;
      default:
        return {
          type: currentNode.text,
          isPointer,
        };
    }
  }
  // 代码可能不完整
  return {
    type: "",
    isPointer: false,
  };
}

export default function* findStructMethod(
  root: Parser.SyntaxNode
): IterableIterator<MethodDefinition> {
  for (const node of root.children) {
    if (node.type !== "method_declaration") {
      continue;
    }

    // 获取参数列表内部的参数声明（只有一个）
    const receiverParams = node.childForFieldName("receiver");
    if (!receiverParams || receiverParams.type !== "parameter_list") continue;

    // 获取接收者参数声明（只有一个）
    const paramDecl = receiverParams.children.find(
      (i) => i.type === "parameter_declaration"
    );
    if (!paramDecl) continue;

    // 获取接收者类型
    const typeNode = paramDecl.childForFieldName("type");
    if (!typeNode) continue;
    const { type: receiverType, isPointer } = resolveTypeNode(typeNode);
    // 获取方法名
    const nameNode = node.childForFieldName("name");
    if (!nameNode || nameNode.type !== "field_identifier") continue;

    // 返回方法定义
    yield {
      name: nameNode.text,
      receiver: receiverType,
      isPointerReceiver: isPointer,
      node,
    };
  }
}
