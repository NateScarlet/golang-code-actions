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

func (s struct1) F1() string {
	return s.f1
}

func (s struct1) F2() int {
	return s.f2
}

func (s struct1) F3() struct {
		f3a string
		f3b uint64
	} {
	return s.f3
}

func (s struct1) F4() interface {
		Method1()
	} {
	return s.f4
}

type Struct2 struct {
	f1 struct1
	f2 []string
	f3 [16]int
	f4 []struct {
		f4a uint64
	}
}

func (s Struct2) F1() struct1 {
	return s.f1
}

func (s Struct2) F2() []string {
	return s.f2
}

func (s Struct2) F3() [16]int {
	return s.f3
}

func (s Struct2) F4() []struct {
		f4a uint64
	} {
	return s.f4
}
