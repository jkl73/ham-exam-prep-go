package router

import (
	"github.com/gorilla/mux"
	"github.com/jkl73/ham-exam-prep-go/server/middleware"
)

// Router for routing
func Router() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/api/getq", middleware.GetQuestionV2).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/exam", middleware.GetSimExam).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/gettitles", middleware.GetTitles).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/getstats", middleware.GetStats).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/saveres", middleware.SaveRes).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/savestatsbatch", middleware.SaveResBatch).Methods("POST", "OPTIONS")
	router.HandleFunc("/image/{filename}", middleware.ReturnImage).Methods("GET", "OPTIONS")
	return router
}
