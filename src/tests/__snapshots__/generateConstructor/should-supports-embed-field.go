package main

import (
	"context"
	"io"
)

func NewStruct1[T any](
	ctx context.Context,
	writer io.Writer,
) *struct1[T] {
	return &struct1[T]{
		ctx,
		writer,
	}
}

type struct1[T any] struct {
	context.Context
	io.Writer
}
