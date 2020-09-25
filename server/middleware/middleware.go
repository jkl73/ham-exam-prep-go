package middleware

import (
	"fmt"
	"math/rand"

	pb "google.golang.org/protobuf/proto"
	// "encoding/json"

	"net/http"

	hamquestions "github.com/lulumel0n/arrl-ham-questions-pool-proto/ham-questions"
	"github.com/lulumel0n/arrl-ham-questions-pool-proto/proto"
)

const questionsTxt = "./server/raw-questions/2019-2023_general.txt"

var q = initQ()

func initQ() *hamquestions.HamQuestion {
	q, err := hamquestions.NewHamQuestion("", questionsTxt)
	if err != nil {
		panic("Cannot init question pool")
	}
	return q
}

// GetQuestion get one question
func GetQuestion(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/octet-stream'") // send
	w.Header().Set("Access-Control-Allow-Origin", "*")

	payload := getOneRandQuestion()

	msg, err := pb.Marshal(payload)

	if err != nil {
		fmt.Println(err)
	}

	bytesSent, err := w.Write(msg)
	if err != nil {
		fmt.Println("failed to send")
		fmt.Println(err)
	} else {
		fmt.Printf("Sent %d\n", bytesSent)
	}
}

func getOneRandQuestion() *proto.Question {

	nsbl := rand.Intn(len(q.Pool.Subl))
	nq := rand.Intn(len(q.Pool.Subl[nsbl].Qlist))

	fmt.Println(q.Pool.Subl[nsbl].Qlist[nq])
	return q.Pool.Subl[nsbl].Qlist[nq]
}
