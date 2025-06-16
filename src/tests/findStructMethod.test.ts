import snapshot from "@nates/snapshot";
import parseDocument from "../parser/parseDocument";
import findStructMethod from "../parser/findStructMethod";

suite("findStructMethod", () => {
  test("should supports valid code", async () => {
    const document = await parseDocument(
      `\
package main

type struct1[T any] struct {
	f1 T
	f2 T
}

func (s struct1[T]) F1() T {
	return s.f1
}

func (s *struct1[T]) F2() T {
	return s.f2
}
`
    );

    const res = Array.from(findStructMethod(document.rootNode));
    snapshot.matchJSON(res.map((i) => ({ ...i, node: {} })));
  });
});
