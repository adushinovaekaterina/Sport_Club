
export class ICreatSemester {
    value?: number;
    date_start?: Date;
    date_end?: Date;
}

export class ISearchSemester {
    values?: number[];
    date_start?: Date;
    date_end?: Date;
}

export class ISemester {
    id?:number
    value?: number;
    date_start?: string;
    date_end?: string;
}
