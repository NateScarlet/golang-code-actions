package main

type struct1[T any] struct {
	f1 T
}

func (s struct1[T]) F1() T {
	return s.f1
}
