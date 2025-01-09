package main

func NewStruct1(
	f1 string,
	f2 string,
) *struct1 {
	return &struct1{
		f1,
		f2,
	}
}

type struct1 struct {
	f1, f2 string
}
