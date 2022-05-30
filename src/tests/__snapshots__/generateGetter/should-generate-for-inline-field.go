package main

type struct1 struct {
	f1, f2 string
}

func (obj struct1) F1() string {
	return obj.f1
}

func (obj struct1) F2() string {
	return obj.f2
}

