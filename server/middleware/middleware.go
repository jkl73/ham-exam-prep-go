package middleware

import (
	"fmt"

	pb "google.golang.org/protobuf/proto"
	// "encoding/json"

	"net/http"

	"github.com/lulumel0n/arrl-ham-questions-pool-proto/proto"
)

// GetQuestion get one question
func GetQuestion(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/octet-stream'") // send
	w.Header().Set("Access-Control-Allow-Origin", "*")

	payload := proto.Question{
		Sublement:   "IMSUBLE",
		Sequence:    2,
		Chapter:     "CH3",
		Stem:        "STEMM",
		Key:         "KEYY",
		Distractors: []string{"DIS1", "DIS2", "DIS3"},
		Figure:      "",
	}

	msg, err := pb.Marshal(&payload)

	if err != nil {
		fmt.Println(err)
	}

	bytesSent, err := w.Write(msg)
	if err != nil {
		fmt.Println("fial to send")
	}

	fmt.Printf("Sent %d\n", bytesSent)

	// json.NewEncoder(w).Encode(payload)
}
