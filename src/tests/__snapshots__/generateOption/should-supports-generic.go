package main

type struct1[T any] struct {
	f1 T
}

type Struct1Option[T any] func(opts *struct1[T])

func Struct1WithF1[T any](f1 T) Struct1Option[T] {
	return func(opts *struct1[T]) {
		opts.f1 = f1
	}
}
