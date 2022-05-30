package main

type struct1 struct {
	f1 string
	f2 int
}

type Struct2 struct {
	struct1
}

type Struct2Option = func(opts *Struct2)

func Struct2OptionStruct1(v struct1) Struct2Option {
	return func(opts *Struct2) {
		opts.struct1 = v
	}
}

