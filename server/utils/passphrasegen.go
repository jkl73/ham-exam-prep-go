package utils

import (
	"bufio"
	"log"
	"math/rand"
	"os"
)

const wordsfile = "../files/words.txt"

var wordslist []string

var cont map[string]map[string]map[string]bool

func init() {
	file, err := os.Open(wordsfile)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		wordslist = append(wordslist, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
}

func getNewRandPassphrase() [3]string {
	randind := rand.Intn(len(wordslist))
	passphrase := [3]string{}
	passphrase[0] = wordslist[randind]
	randind = rand.Intn(len(wordslist))
	passphrase[1] = wordslist[randind]
	randind = rand.Intn(len(wordslist))
	passphrase[2] = wordslist[randind]
	return passphrase
}

func GenPassphrase() string {
	x := getNewRandPassphrase()
	return x[0] + "-" + x[1] + "-" + x[2]
}
