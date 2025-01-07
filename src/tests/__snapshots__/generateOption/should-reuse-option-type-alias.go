package main

type Struct1 struct {
	f1 string
}

type MyStruct1Option func(*Struct1)

func MyStruct1WithF1(v string) MyStruct1Option {
	return func(opts *Struct1) {
		opts.f1 = v
	}
}

