package main

import (
	"context"
	"io"
)

type struct1[T any] struct {
	context.Context
	io.Writer
}
