import { Topics } from "../enums/topics";
import { ValueSubjects } from "../enums/value-subjects";

export interface Event {
    topic: Topics;
    value: any;
    valueSubject:ValueSubjects
}

