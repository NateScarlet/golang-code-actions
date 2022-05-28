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
) (obj *struct1, err error) {
	obj = &struct1{
		f1: f1,
		f2: f2,
		f3: f3,
		f4: f4,
		F5: f5,
	}
	return
}

func NewStruct2(
	f1 struct1,
	f2 []string,
	f3 [16]int,
	f4 []struct {
		f4a uint64
	},
) (obj *Struct2, err error) {
	obj = &Struct2{
		f1: f1,
		f2: f2,
		f3: f3,
		f4: f4,
	}
	return
}
