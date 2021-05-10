package utils

import (
	"testing"
)

func TestGenPassphrase(t *testing.T) {
	x := GenPassphrase()
	if len(x) <= 10 || len(x) >= 20 {
		t.Errorf("GenPassphrase: %s", x)
	}
}
