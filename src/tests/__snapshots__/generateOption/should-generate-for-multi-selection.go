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
	F5 string `json:"field5"`
}

type Struct1Option = func(opts *struct1)

func Struct1WithF2(f2 int) Struct1Option {
	return func(opts *struct1) {
		opts.f2 = f2
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

type MyStruct2Option = func(*Struct2)

func MyStruct2WithF1(f1 struct1) MyStruct2Option {
	return func(opts *Struct2) {
		opts.f1 = f1
	}
}
