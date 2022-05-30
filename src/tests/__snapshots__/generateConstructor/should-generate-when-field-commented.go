package main

type struct1 struct {
	// comment
	f1 string
}

func NewStruct1(
	f1 string,
) (obj *struct1, err error) {
	obj = &struct1{
		f1: f1,
	}
	return
}

