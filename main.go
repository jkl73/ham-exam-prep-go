package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jkl73/ham-exam-prep-go/server/router"
)

func main() {
	args := os.Args[1:]
	r := router.Router()

	if len(args) < 2 {
		fmt.Println("Usage: <cert> <key> to start https, start without tls instead")
		fmt.Println("Starting server on the port 8080...")
		log.Fatal(http.ListenAndServe(":8080", r))
	} else {
		certFile := args[0]
		privkeyFile := args[1]
		fmt.Println("Starting server on the port 8080 with tls...")
		log.Fatal(http.ListenAndServeTLS(":8080", certFile, privkeyFile, r))
	}
}
