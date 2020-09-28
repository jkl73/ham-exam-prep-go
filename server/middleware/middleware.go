package middleware

import (
	"fmt"
	"io/ioutil"
	"math/rand"

	pb "google.golang.org/protobuf/proto"

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

// GetSimExam returns a complete exam questions set
func GetSimExam(w http.ResponseWriter, r *http.Request) {
	exampb := getSimExamQuestions()
	msg, err := pb.Marshal(exampb)
	if err != nil {
		fmt.Println(err)
	}
	sendGeneric(w, r, msg)
}

// GetQuestion get one question
func GetQuestion(w http.ResponseWriter, r *http.Request) {
	question := getOneRandQuestion()
	msg, err := pb.Marshal(question)
	if err != nil {
		fmt.Println(err)
	}
	sendGeneric(w, r, msg)
}

func sendGeneric(w http.ResponseWriter, r *http.Request, payload []byte) {
	w.Header().Set("Context-Type", "application/octet-stream'") // send
	w.Header().Set("Access-Control-Allow-Origin", "*")

	bytesSent, err := w.Write(payload)
	if err != nil {
		fmt.Println("Failed to send")
		fmt.Println(err)
	} else {
		fmt.Printf("Sent %d\n", bytesSent)
	}
}

func getSimExamQuestions() *proto.QuestionList {
	res := proto.QuestionList{}
	for _, sub := range q.Pool.Subl {
		for _, qList := range sub.GetGroupMap() {
			nq := rand.Intn(len(qList.GetQuestions()))
			res.Questions = append(res.Questions, qList.GetQuestions()[nq])
		}
	}
	return &res
}

func getOneRandQuestion() *proto.Question {
	nsbl := rand.Intn(len(q.Pool.Subl))
	// get the first one
	for _, qList := range q.Pool.Subl[nsbl].GetGroupMap() {
		nq := rand.Intn(len(qList.GetQuestions()))
		return qList.GetQuestions()[nq]
	}
	return nil
}

func ReturnImage(w http.ResponseWriter, r *http.Request) {

	data, err := ioutil.ReadFile("./image/2019-2023_general-G7-1.jpeg")

	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Context-Type", "image/jpeg") // send
	w.Header().Set("Access-Control-Allow-Origin", "*")

	bytesSent, err := w.Write(data)

	if err != nil {
		fmt.Println("Failed to send")
		fmt.Println(err)
	} else {
		fmt.Printf("Sent image %d\n", bytesSent)
	}
}
