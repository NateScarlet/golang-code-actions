package main

type struct1 struct {
	f1 string
	f2 int
	f3 struct {
		f3a string
		f3b uint64
	}
	f4 interface {
		Method1()
	}
}

func (s *struct1) F1() (_ string) {
	if s == nil {
		return
	}
	return s.f1
}

type Struct2 struct {
	f1 struct1
	f2 []string
	f3 [16]int
	f4 []struct {
		f4a uint64
	}
}

func (s *Struct2) F1() (_ struct1) {
	if s == nil {
		return
	}
	return s.f1
}
