package main

type struct1 struct {
	f1, f2 string
}

func NewStruct1(
	f1 string,
	f2 string,
) (obj *struct1, err error) {
	obj = &struct1{
		f1: f1,
		f2: f2,
	}
	return
}

