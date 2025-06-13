package main

type struct1 struct {
	f1 string
	f2 int
}

type Struct2 struct {
	struct1
}

func (s *Struct2) Struct1() (_ struct1) {
	if s == nil {
		return
	}
	return s.struct1
}
