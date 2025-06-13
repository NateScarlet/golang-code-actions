package main

type struct1 struct {
	// comment
	f1 string
}

func (s *struct1) F1() (_ string) {
	if s == nil {
		return
	}
	return s.f1
}
// last line content