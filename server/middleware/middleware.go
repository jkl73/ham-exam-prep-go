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
		Sublement:   "G1B",
		Sequence:    3,
		Chapter:     "[97.3(a)(9)]",
		Stem:        "Which of the following is a purpose of a beacon station as identified in the FCC rules?",
		Key:         "Observation of propagation and reception",
		Distractors: []string{"Automatic identification of repeaters", "Transmission of bulletins of general interest to Amateur Radio licensees", "Identifying net frequencies"},
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
