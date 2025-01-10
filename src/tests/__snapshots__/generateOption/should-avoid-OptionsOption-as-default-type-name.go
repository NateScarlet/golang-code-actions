package main

type someOptions struct {
	f1 string
	f2 string
}

type SomeOption = func(opts *someOptions)

func SomeWithF2(f2 string) SomeOption {
	return func(opts *someOptions) {
		opts.f2 = f2
	}
}
