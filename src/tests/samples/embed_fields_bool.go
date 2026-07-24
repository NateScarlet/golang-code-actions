package main

import "io"

type Struct1 struct {
	io.Writer
	enabled bool
}
