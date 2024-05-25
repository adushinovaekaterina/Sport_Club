export interface IMENU {
    id: number
    title: string
    hidden: boolean,
    menu_types: IMenuTypes[]
}

export interface IMenuTypes {
    id: number
    title: string
    checked: boolean
}

export interface ISeriesLine {
    name: string;
    data: number[],
    type: 'line'
}
