package main

type someOptions struct {
	f1 string
	f2 string
}

type SomeOption = func(opts *someOptions)

func SomeOptionF2(v string) SomeOption {
	return func(opts *someOptions) {
		opts.f2 = v
	}
}

