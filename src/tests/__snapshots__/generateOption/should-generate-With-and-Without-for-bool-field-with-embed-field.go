package main

import "io"

type Struct1 struct {
	io.Writer
	enabled bool
}

type Struct1Option = func(opts *Struct1)

func Struct1WithEnabled() Struct1Option {
	return func(opts *Struct1) {
		opts.enabled = true
	}
}

func Struct1WithoutEnabled() Struct1Option {
	return func(opts *Struct1) {
		opts.enabled = false
	}
}
