package main

type struct1 struct {
	f1, f2 string
}

func (s struct1) F1() string {
	return s.f1
}

func (s struct1) F2() string {
	return s.f2
}
