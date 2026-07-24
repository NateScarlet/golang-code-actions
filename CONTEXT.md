# Golang Code Actions

一个 VS Code 扩展，基于 tree-sitter 解析 Go 源码并自动生成样板代码（getter、构造函数、functional options）。

## 语言

**Gettable field（可获取字段）**:
名称以小写字母开头的未导出结构体字段，是 getter 生成的合法候选。
_Avoid_: 未导出字段, 私有字段

**Constructor（构造函数）**:
生成的 `NewXxx` 或 `NewXxx[T]` 函数，用于创建结构体实例。当为所有字段生成时返回 `*Struct`；仅部分字段时返回 `(*Struct, error)`。
_Avoid_: 初始化函数, New 函数

**Functional option（选项函数）**:
生成的 `StructWithXxx(value)` 函数，接受值并返回 `StructOption` 类型（`func(*Struct)`）。用于在构造后按需设置字段。
_Avoid_: 选项模式, Option 函数

**Receiver convention（接收者约定）**:
自动选择指针/值接收者的启发式规则——统计结构体已有方法中指针接收者的比例，采用多数方。
_Avoid_: 接收者类型

**Inline field（内联字段）**:
在同一行声明的多个同类型字段（如 `a, b string`），共享同一个类型节点，生成时需要逐一展开。
_Avoid_: 连续字段, 同行字段

**Embedded field（内嵌字段）**:
嵌入到结构体中的匿名类型字段（如 `io.Writer`），`embeded` 标记为 `true`。字段名称解析规则不同于普通字段。
_Avoid_: 匿名字段, 嵌入字段

**Option type（选项类型别名）**:
形如 `type XxxOption = func(*Xxx)` 的类型别名，标记该结构体已启用 functional options 模式，避免重复生成。
_Avoid_: 选项别名, Option 别名
