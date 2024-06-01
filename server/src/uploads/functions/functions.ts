
// TODO: duplicate file on client in teams/progress, need to add this in database
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

export function convertValueToPoint(name: string, value: number) {
    const standard = standards.find(standard => standard.name === name);
    let score = -1
    switch (standard?.id) {
        case 0:
            if (value < 21) {
                score = 1;
            } else if (value >= 21 && value <= 25) {
                score = 2;
            } else if (value >= 26 && value <= 38) {
                score = 3;
            } else if (value >= 39 && value <= 43) {
                score = 4;
            } else if (value > 43) {
                score = 5;
            }
            break;
        case 1:
            if (value < 25) {
                score = 1;
            } else if (value >= 25 && value <= 33) {
                score = 2;
            } else if (value >= 34 && value <= 46) {
                score = 3;
            } else if (value >= 46 && value <= 47) {
                score = 4;
            } else if (value > 47) {
                score = 5;
            }
            break;
        case 2:
            if (value < 5) {
                score = 1;
            } else if (value >= 5 && value <= 7) {
                score = 2;
            } else if (value >= 8 && value <= 10) {
                score = 3;
            } else if (value >= 11 && value <= 15) {
                score = 4;
            } else if (value > 16) {
                score = 5;
            }
            break;
        case 3:
            if (value < 133) {
                score = 1;
            } else if (value >= 133 && value <= 143) {
                score = 2;
            } else if (value >= 144 && value <= 170) {
                score = 3;
            } else if (value >= 171 && value <= 182) {
                score = 4;
            } else if (value > 182) {
                score = 5;
            }
            break;
        case 4:
            if (value > 23.2) {
                score = 1;
            } else if (value >= 22.3 && value <= 23.2) {
                score = 2;
            } else if (value >= 20.1 && value <= 22.2) {
                score = 3;
            } else if (value >= 19.0 && value <= 20.0) {
                score = 4;
            } else if (value < 19.0) {
                score = 5;
            }
            break;
        case 5:
            if (value > 18.0) {
                score = 1;
            } else if (value >= 17.6 && value <= 18.0) {
                score = 2;
            } else if (value >= 17.1 && value <= 17.5) {
                score = 3;
            } else if (value >= 16.6 && value <= 17.0) {
                score = 4;
            } else if (value <= 16.5) {
                score = 5;
            }
            break;
        case 6:
            if (value > 8.21) {
                score = 1;
            } else if (value >= 7.29 && value <= 8.23) {
                score = 2;
            } else if (value >= 5.37 && value <= 7.28) {
                score = 3;
            } else if (value >= 4.01 && value <= 5.36) {
                score = 4;
            } else if (value < 4.01) {
                score = 5;
            }
            break;
        case 7:
            if (value > 14.00) {
                score = 1;
            } else if (value >= 13.11 && value <= 14.00) {
                score = 2;
            } else if (value >= 12.31 && value <= 13.10) {
                score = 3;
            } else if (value >= 10.50 && value <= 12.30) {
                score = 4;
            } else if (value < 10.50) {
                score = 5;
            }
            break;
    }

    return score

}

export function percentVisits(dateStart: Date, dateEnd: Date) {
    let t = dateEnd.getTime() - dateStart.getTime()
    let days = t / (1000 * 60 * 60 * 24)
    // in percents +1 (include start date)
    return (days + 1) * 3
}
