import type {ISemesterTemp, ISemesterHalfed} from "@/store/models/other";

export const standards = [
    {id: 0, name: "Сгибание и разгибание рук в упоре лежа на коленях (раз)"},
    {id: 1, name: "Поднимание туловища из положения лежа на спине за 60 с (раз)"},
    {id: 2, name: "Наклон вперед из положения стоя (см)"},
    {id: 3,name: "Прыжок в длину с места (см)"},
    {id: 4,name: "Челночный бег 10х5 м (с)"},
    {id: 5,name: "Бег 100 м (с)"},
    {id: 6,name: "Бег 1000 м (мин., с)"},
    {id: 7,name: "Бег 2000 м (мин, с)"}
]


export const semestersHalfed:ISemesterHalfed[] = [
    {id: 0, name: "1 семестр (начало)", isStart: true, semester: 0.5},
    {id: 1, name: "1 семестр (конец) ", isStart: false, semester: 1},
    {id: 2, name: "2 семестр (начало)", isStart: true, semester: 1.5},
    {id: 3, name: "2 семестр (конец)", isStart: false, semester: 2},
    // {id: 4, name: "3 семестр (начало)", isStart: true, semester: 2.5},
    // {id: 5, name: "3 семестр (конец)", isStart: false, semester: 3},
    // {id: 6, name: "4 семестр (начало)", isStart: true, semester: 3.5},
    // {id: 7, name: "4 семестр (конец)", isStart: false, semester: 4},
    // {id: 8, name: "5 семестр (начало)", isStart: true, semester: 4.5},
    // {id: 9, name: "5 семестр (конец)", isStart: false, semester: 5},
    //
    // {id: 10, name: "6 семестр (начало)", isStart: true, semester: 5.5},
    // {id: 11, name: "6 семестр (конец)", isStart: false, semester: 6},
    // {id: 12, name: "7 семестр (начало)", isStart: true, semester: 6.5},
    // {id: 13, name: "7 семестр (конец)", isStart: false, semester: 7},
    // {id: 14, name: "8 семестр (начало)", isStart: true, semester: 7.5},
    // {id: 15, name: "8 семестр (конец)", isStart: false, semester: 8},
    // {id: 16, name: "9 семестр (начало)", isStart: true, semester: 8.5},
    // {id: 17, name: "9 семестр (конец)", isStart: false, semester: 9},
    // {id: 18, name: "10 семестр (начало)", isStart: true, semester: 9.5},
    // {id: 19, name: "10 семестр (конец)", isStart: false, semester: 10}
];

export const semesters:ISemesterTemp[] = [
    {id: 0, name: "1 семестр",  semester: 1},
    {id: 2, name: "2 семестр",  semester: 2},
    {id: 4, name: "3 семестр", semester: 3},
    {id: 6, name: "4 семестр", semester: 4},
];
