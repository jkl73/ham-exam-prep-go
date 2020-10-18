package middleware

import (
	"fmt"
	"io/ioutil"

	"github.com/lulumel0n/arrl-ham-questions-pool-proto/proto"
	pb "google.golang.org/protobuf/proto"
)

const savedFileName = "SavedStat.stat"

// StatManager manages stats
type StatManager struct {
	statmap *proto.PersonalStat
}

func (sm StatManager) addStat(statmsg *proto.StatMsg) {
	// get key
	keyy := fmt.Sprint(statmsg.GetSubelement(), statmsg.GetGroup(), statmsg.GetSequence())
	sqs := &proto.SingleQuestionStat{}

	if val, ok := sm.statmap.GetStatsMap()[keyy]; ok {
		sqs = val
	} else {
		sm.statmap.GetStatsMap()[keyy] = sqs
	}

	switch statmsg.GetVerdict() {
	case proto.StatsVerdict_STAT_CORRECT:
		sqs.Correct++
	case proto.StatsVerdict_STAT_UNKNOWN:
		sqs.Unknown++
	case proto.StatsVerdict_STAT_WRONG:
		sqs.Wrong++
	}
}

// NewStatManager return stat manager
func NewStatManager() StatManager {
	stat, err := readFromFile(savedFileName)
	sm := StatManager{}
	if err == nil {
		sm.statmap = stat
		return sm
	}
	stat = &proto.PersonalStat{}
	stat.StatsMap = make(map[string]*proto.SingleQuestionStat)
	sm.statmap = stat

	return sm
}

// SaveToFile save the stats to file
func (sm StatManager) SaveToFile() error {
	marshaled, err := pb.Marshal(sm.statmap)
	if err != nil {
		return err
	}
	if err = ioutil.WriteFile(savedFileName, marshaled, 0644); err != nil {
		return err
	}
	return nil
}

func readFromFile(filename string) (*proto.PersonalStat, error) {
	dat, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	res := &proto.PersonalStat{}
	if err := pb.Unmarshal(dat, res); err != nil {
		return nil, err
	}

	return res, nil
}
