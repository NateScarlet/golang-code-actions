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

type Struct2 struct {
	f1 struct1
	f2 []string
	f3 [16]int
	f4 []struct {
		f4a uint64
	}
}

func (obj struct1) F1() string {
	return obj.f1
}

func (obj struct1) F2() int {
	return obj.f2
}

func (obj struct1) F3() struct {
		f3a string
		f3b uint64
	} {
	return obj.f3
}

func (obj struct1) F4() interface {
		Method1()
	} {
	return obj.f4
}

func (obj Struct2) F1() struct1 {
	return obj.f1
}

func (obj Struct2) F2() []string {
	return obj.f2
}

func (obj Struct2) F3() [16]int {
	return obj.f3
}

func (obj Struct2) F4() []struct {
		f4a uint64
	} {
	return obj.f4
}

