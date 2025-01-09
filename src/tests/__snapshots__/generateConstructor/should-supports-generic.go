package main

func NewStruct1[T any](
	f1 T,
) *struct1[T] {
	return &struct1[T]{
		f1,
	}
}

type struct1[T any] struct {
	f1 T
}
