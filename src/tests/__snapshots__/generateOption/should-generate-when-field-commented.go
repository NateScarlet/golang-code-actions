package main

type struct1 struct {
	// comment
	f1 string
}

type Struct1Option = func(opts *struct1)

func Struct1OptionF1(v string) Struct1Option {
	return func(opts *struct1) {
		opts.f1 = v
	}
}

