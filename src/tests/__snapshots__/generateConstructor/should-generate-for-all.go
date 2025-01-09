package main

func NewStruct1(
	f1 string,
	f2 int,
	f3 struct {
		f3a string
		f3b uint64
	},
	f4 interface {
		Method1()
	},
	f5 string,
) *struct1 {
	return &struct1{
		f1,
		f2,
		f3,
		f4,
		f5,
	}
}

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

func NewStruct2(
	f1 struct1,
	f2 []string,
	f3 [16]int,
	f4 []struct {
		f4a uint64
	},
) *Struct2 {
	return &Struct2{
		f1,
		f2,
		f3,
		f4,
	}
}

type Struct2 struct {
	f1 struct1
	f2 []string
	f3 [16]int
	f4 []struct {
		f4a uint64
	}
}
