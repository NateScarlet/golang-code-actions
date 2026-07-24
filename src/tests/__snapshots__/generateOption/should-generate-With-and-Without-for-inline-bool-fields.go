package main

type struct1 struct {
	f1, f2 bool
}

type Struct1Option = func(opts *struct1)

func Struct1WithF1() Struct1Option {
	return func(opts *struct1) {
		opts.f1 = true
	}
}

func Struct1WithoutF1() Struct1Option {
	return func(opts *struct1) {
		opts.f1 = false
	}
}

func Struct1WithF2() Struct1Option {
	return func(opts *struct1) {
		opts.f2 = true
	}
}

func Struct1WithoutF2() Struct1Option {
	return func(opts *struct1) {
		opts.f2 = false
	}
}
