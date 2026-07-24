package main

type struct1 struct {
	enabled bool
	noCopy  bool
	disableBackup bool
}

type Struct1Option = func(opts *struct1)

func Struct1WithBackup() Struct1Option {
	return func(opts *struct1) {
		opts.disableBackup = false
	}
}

func Struct1WithoutBackup() Struct1Option {
	return func(opts *struct1) {
		opts.disableBackup = true
	}
}
