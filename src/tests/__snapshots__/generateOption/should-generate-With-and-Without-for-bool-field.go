package main

type struct1 struct {
	enabled bool
	noCopy  bool
	disableBackup bool
}

type Struct1Option = func(opts *struct1)

func Struct1WithEnabled() Struct1Option {
	return func(opts *struct1) {
		opts.enabled = true
	}
}

func Struct1WithoutEnabled() Struct1Option {
	return func(opts *struct1) {
		opts.enabled = false
	}
}
