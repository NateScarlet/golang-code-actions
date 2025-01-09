package main

type struct1 struct {
	f1 string
	f2 int
}

func NewStruct2(
	struct1 struct1,
) *Struct2 {
	return &Struct2{
		struct1,
	}
}

type Struct2 struct {
	struct1
}
