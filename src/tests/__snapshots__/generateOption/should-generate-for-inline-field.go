package main

type struct1 struct {
	f1, f2 string
}

type Struct1Option = func(opts *struct1)

func Struct1WithF1(f1 string) Struct1Option {
	return func(opts *struct1) {
		opts.f1 = f1
	}
}

func Struct1WithF2(f2 string) Struct1Option {
	return func(opts *struct1) {
		opts.f2 = f2
	}
}
