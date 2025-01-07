package main

type struct1 struct {
	f1 string
	f2 int
	f3 struct {
		f3a string
		f3b uint64
	}
	f4 interface {
		Method1()
	}
	F5 string `json:"field5"`
}

type Struct2 struct {
	f1 struct1
	f2 []string
	f3 [16]int
	f4 []struct {
		f4a uint64
	}
}

type MyStruct2Option = func(*Struct2)

type Struct1Option = func(opts *struct1)

func Struct1OptionF1(v string) Struct1Option {
	return func(opts *struct1) {
		opts.f1 = v
	}
}

func Struct1OptionF2(v int) Struct1Option {
	return func(opts *struct1) {
		opts.f2 = v
	}
}

func Struct1OptionF3(v struct {
		f3a string
		f3b uint64
	}) Struct1Option {
	return func(opts *struct1) {
		opts.f3 = v
	}
}

func Struct1OptionF4(v interface {
		Method1()
	}) Struct1Option {
	return func(opts *struct1) {
		opts.f4 = v
	}
}

func Struct1OptionF5(v string) Struct1Option {
	return func(opts *struct1) {
		opts.F5 = v
	}
}

func MyStruct2WithF1(v struct1) MyStruct2Option {
	return func(opts *Struct2) {
		opts.f1 = v
	}
}

func MyStruct2WithF2(v ...string) MyStruct2Option {
	return func(opts *Struct2) {
		opts.f2 = v
	}
}

func MyStruct2WithF3(v [16]int) MyStruct2Option {
	return func(opts *Struct2) {
		opts.f3 = v
	}
}

func MyStruct2WithF4(v ...struct {
		f4a uint64
	}) MyStruct2Option {
	return func(opts *Struct2) {
		opts.f4 = v
	}
}

