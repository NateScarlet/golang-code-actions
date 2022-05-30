package main

type struct1 struct {
	f1 string
	f2 int
}

type Struct2 struct {
	struct1
}

func NewStruct2(
	struct1 struct1,
) (obj *Struct2, err error) {
	obj = &Struct2{
		struct1: struct1,
	}
	return
}

