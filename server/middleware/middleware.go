package middleware

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"math/rand"
	"strconv"
	"strings"

	pb "google.golang.org/protobuf/proto"

	"net/http"

	"github.com/gorilla/mux"
	hamquestions "github.com/jkl73/arrl-ham-questions-pool-proto/ham-questions"
	"github.com/jkl73/arrl-ham-questions-pool-proto/proto"
)

const techFile = "./server/files/2018-2022_technician.txt"
const generalFile = "./server/files/2019-2023_general.txt"
const extraFile = "./server/files/2020-2024_extra.txt"

const qchapter = "chapter"

var techQuestionsPool, techQuestionTitles = initProtos(hamquestions.Tech)
var generalQuestionPool, generalQuestionTitles = initProtos(hamquestions.General)
var extraQuestionPool, extraQuestionTitles = initProtos(hamquestions.Extra)

var statManager = NewStatManager()

func initProtos(level hamquestions.Level) (*proto.CompleteQuestionPool, *proto.AllTitles) {

	var fname string
	if level == hamquestions.Extra {
		fname = extraFile
	} else if level == hamquestions.General {
		fname = generalFile
	} else if level == hamquestions.Tech {
		fname = techFile
	} else {
		panic("wtf")
	}

	question, titles, err := hamquestions.NewHamQuestionsAndTitles("", fname, level)
	if err != nil {
		fmt.Printf("cannot init questions proto %s", fname)
		panic(err)
	}
	return question, titles
}

// GetSimExam returns a complete exam questions set
func GetSimExam(w http.ResponseWriter, r *http.Request) {
	prio := 0
	if len(r.URL.Query()["prioWrong"]) > 0 {
		prio = 1
	}

	level := r.URL.Query()["level"]
	lv := mapToLevelEnum(level[0])

	exampb := getSimExamQuestions(prio, lv)
	msg, err := pb.Marshal(exampb)
	if err != nil {
		fmt.Println(err)
	} else {
		sendGeneric(w, r, msg)
	}
}

// GetQuestionV2 can accept params (charpter) to return a specific domain
func GetQuestionV2(w http.ResponseWriter, r *http.Request) {
	chs := r.URL.Query()[qchapter]

	level := r.URL.Query()["level"]
	lv := mapToLevelEnum(level[0])

	prio := 0
	if len(r.URL.Query()["prioWrong"]) > 0 {
		prio = 1
	}

	question := &proto.Question{}
	attempt := 0

	var key string
	var correct int32
	var unknown int32
	var wrong int32
	var dice float64
	var calcedScore float64

	for ; attempt < 10; attempt++ {
		if len(chs) == 0 {
			question = getOneRandQuestion(lv)
		} else {
			chosenChapter := chs[rand.Intn(len(chs))]
			// qn := rand.Intn(len(questionPool.SubelementMap[strings.ToUpper(string(choseChs[0:2]))].
			// 	GetGroupMap()[strings.ToUpper(string(choseChs[2]))].
			// 	GetQuestions()))
			// question = questionPool.SubelementMap[strings.ToUpper(string(choseChs[0:2]))].
			// 	GetGroupMap()[strings.ToUpper(string(choseChs[2]))].
			// 	GetQuestions()[qn]
			question = getQuestionInChapter(lv, chosenChapter)
		}

		// if no priority enforced, just return this
		if prio == 0 {
			break
		}

		key = question.GetSubelement() + question.GetGroup() + strconv.Itoa(int(question.GetSequence()))
		correct = statManager.statmap.GetStatsMap()[key].GetCorrect()
		wrong = statManager.statmap.GetStatsMap()[key].GetWrong()
		unknown = statManager.statmap.GetStatsMap()[key].GetUnknown()

		calcedScore = calcScore(key)
		// if score < 0.5, return this
		if calcedScore < 0.5 {
			break
		}

		// if score >= 0.5, select based on prob
		dice = rand.Float64()
		if dice > calcedScore {
			break
		}
	}

	if prio != 0 {
		clonedQ := pb.Clone(question).(*proto.Question)
		clonedQ.Stem = clonedQ.Stem + " [" +
			strconv.Itoa(attempt) + " " +
			key + " " +
			fmt.Sprintf("%.2f", calcedScore) + " " +
			fmt.Sprintf("%.2f", dice) + " | " +
			strconv.Itoa(int(correct)) + " " +
			strconv.Itoa(int(unknown)) + " " +
			strconv.Itoa(int(wrong)) + "]"

		question = clonedQ
	}

	msg, err := pb.Marshal(question)
	if err != nil {
		fmt.Println(err)
	} else {
		sendGeneric(w, r, msg)
	}
}

// calculate a question score by its appearance
// if a question never appeared, than score is 0.1
// the lower the score, the lower the confidence

func calcScore(k string) float64 {
	correct := statManager.statmap.GetStatsMap()[k].GetCorrect()
	wrong := statManager.statmap.GetStatsMap()[k].GetWrong()
	unknown := statManager.statmap.GetStatsMap()[k].GetUnknown()
	totalApp := unknown + wrong + correct

	if totalApp == 0 {
		return 0.1
	}

	return float64(correct) / (float64(totalApp) + 0.65)
}

// GetTitles will return all subelements and groups title
func GetTitles(w http.ResponseWriter, r *http.Request) {
	level := r.URL.Query()["level"]
	lv := mapToLevelEnum(level[0])

	msg, err := pb.Marshal(mapToLevelTitle(lv))
	if err != nil {
		fmt.Println(err)
	} else {
		sendGeneric(w, r, msg)
	}
}

// ReturnImage return an image
func ReturnImage(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	fn := vars["filename"]
	// clean filename

	fn = strings.Replace(fn, "/", "", -1)
	fn = strings.Replace(fn, ".", "", -1)
	fn = strings.Replace(fn, "\\", "", -1)
	fn = strings.Replace(fn, " ", "", -1)

	fmt.Println(fn)

	data, err := ioutil.ReadFile("./image/" + fn + ".png")

	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Context-Type", "image/png") // send
	w.Header().Set("Access-Control-Allow-Origin", "*")

	bytesSent, err := w.Write(data)
	if err != nil {
		fmt.Println("Failed to send")
		fmt.Println(err)
	} else {
		fmt.Printf("Sent image %d\n", bytesSent)
	}
}

// SaveRes save
func SaveRes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

	if r.Method == "POST" {
		buf := new(bytes.Buffer)
		_, err := buf.ReadFrom(r.Body)

		if err != nil {
			fmt.Println(err)
		}
		res := &proto.StatMsg{}
		pb.Unmarshal(buf.Bytes(), res)
		statManager.addStat(res)
	} else {
		fmt.Println("receive not post")
	}
	statManager.SaveToFile()
}

// SaveResBatch save batch stat res
func SaveResBatch(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

	if r.Method == "POST" {
		buf := new(bytes.Buffer)
		_, err := buf.ReadFrom(r.Body)

		if err != nil {
			fmt.Println(err)
		}
		res := &proto.StatMsgs{}
		pb.Unmarshal(buf.Bytes(), res)
		for _, singlestat := range res.GetMsgs() {
			statManager.addStat(singlestat)
		}

	} else {
		fmt.Println("receive not post")
	}
	statManager.SaveToFile()
}

// GetStats return the stats manager pb
func GetStats(w http.ResponseWriter, r *http.Request) {
	msg, err := pb.Marshal(statManager.statmap)
	if err != nil {
		fmt.Println(err)
	} else {
		sendGeneric(w, r, msg)
	}
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

func getSimExamQuestions(prio int, lv hamquestions.Level) *proto.QuestionList {
	selectedpool := mapToLevelQuestionPool(lv)

	res := proto.QuestionList{}
	for subID, sub := range selectedpool.SubelementMap {
		for groupID, qList := range sub.GetGroupMap() {
			nq := rand.Intn(len(qList.GetQuestions()))
			if prio == 1 {

				calcedScore := 0.0
				attempt := 0
				dice := 0.0
				var key string

				for ; attempt < 10; attempt++ {
					nq = rand.Intn(len(qList.GetQuestions()))
					key = subID + groupID + strconv.Itoa(int(nq)+1) // 1 based

					calcedScore = calcScore(key)
					// if calcedScore < 0.5, return this
					if calcedScore < 0.5 {
						break
					}
					// if score >= 0.5, select based on prob
					dice = rand.Float64()
					if dice > calcedScore {
						break
					}
				}

				correct := statManager.statmap.GetStatsMap()[key].GetCorrect()
				wrong := statManager.statmap.GetStatsMap()[key].GetWrong()
				unknown := statManager.statmap.GetStatsMap()[key].GetUnknown()
				// totalApp := unknown + wrong + correct

				clonedQ := pb.Clone(qList.GetQuestions()[nq]).(*proto.Question)
				clonedQ.Stem = clonedQ.Stem + " [" +
					strconv.Itoa(attempt) + " " +
					key + " " +
					fmt.Sprintf("%.2f", calcedScore) + " " +
					fmt.Sprintf("%.2f", dice) + " | " +
					strconv.Itoa(int(correct)) + " " +
					strconv.Itoa(int(unknown)) + " " +
					strconv.Itoa(int(wrong)) + "]"
				res.Questions = append(res.Questions, clonedQ)
			} else {
				res.Questions = append(res.Questions, qList.GetQuestions()[nq])
			}
		}
	}
	return &res
}

func getOneRandQuestion(lv hamquestions.Level) *proto.Question {
	selectedpool := mapToLevelQuestionPool(lv)

	// get the first one (random)
	for _, subelement := range selectedpool.SubelementMap {
		for _, group := range subelement.GroupMap {
			nq := rand.Intn(len(group.GetQuestions()))
			return group.GetQuestions()[nq]
		}
	}
	return nil
}

func getQuestionInChapter(lv hamquestions.Level, ch string) *proto.Question {
	selectedpool := mapToLevelQuestionPool(lv)

	qn := rand.Intn(len(selectedpool.SubelementMap[strings.ToUpper(string(ch[0:2]))].
		GetGroupMap()[strings.ToUpper(string(ch[2]))].
		GetQuestions()))
	return selectedpool.SubelementMap[strings.ToUpper(string(ch[0:2]))].
		GetGroupMap()[strings.ToUpper(string(ch[2]))].
		GetQuestions()[qn]
}

func mapToLevelQuestionPool(lv hamquestions.Level) *proto.CompleteQuestionPool {
	if lv == hamquestions.Tech {
		return techQuestionsPool
	} else if lv == hamquestions.General {
		return generalQuestionPool
	} else if lv == hamquestions.Extra {
		return extraQuestionPool
	} else {
		panic("wtf")
	}
}

func mapToLevelTitle(lv hamquestions.Level) *proto.AllTitles {
	if lv == hamquestions.Tech {
		return techQuestionTitles
	} else if lv == hamquestions.General {
		return generalQuestionTitles
	} else if lv == hamquestions.Extra {
		return extraQuestionTitles
	} else {
		panic("wtf")
	}
}

func mapToLevelEnum(level string) hamquestions.Level {
	switch level {
	case "T":
		return hamquestions.Tech
	case "G":
		return hamquestions.General
	case "E":
		return hamquestions.Extra
	}
	panic("wtf")
}
