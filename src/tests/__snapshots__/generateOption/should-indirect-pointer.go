package main

type Struct1 struct {
	f1 *string
}

type Struct1Option = func(opts *Struct1)

func Struct1OptionF1(v string) Struct1Option {
	return func(opts *Struct1) {
		opts.f1 = &v
	}
}

