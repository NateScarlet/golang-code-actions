package main

type struct1 struct {
	f1 string
	f2 int
}

type Struct2 struct {
	struct1
}

func (s Struct2) Struct1() struct1 {
	return s.struct1
}
