package main

type struct1 struct {
	enabled bool
	noCopy  bool
	disableBackup bool
}

type Struct1Option = func(opts *struct1)

func Struct1WithCopy() Struct1Option {
	return func(opts *struct1) {
		opts.noCopy = false
	}
}

func Struct1WithoutCopy() Struct1Option {
	return func(opts *struct1) {
		opts.noCopy = true
	}
}
