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

func (s *struct1) F3() (_ struct {
		f3a string
		f3b uint64
	}) {
	if s == nil {
		return
	}
	return s.f3
}

type Struct2 struct {
	f1 struct1
	f2 []string
	f3 [16]int
	f4 []struct {
		f4a uint64
	}
}
