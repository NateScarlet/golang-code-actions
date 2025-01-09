package main

func NewStruct1(
	f1 string,
) *struct1 {
	return &struct1{
		f1,
	}
}

type struct1 struct {
	// comment
	f1 string
}
