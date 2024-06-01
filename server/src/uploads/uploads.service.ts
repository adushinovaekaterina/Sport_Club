import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import * as fs from 'fs';
import {createWriteStream} from 'fs';
import {Workbook, Worksheet} from 'exceljs';
import {Response} from 'express';
import * as sharp from 'sharp';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";
import {ScheduleService} from "../schedule/schedule.service";
import {TeamsService} from "../teams/teams.service";
import {SearchVisitsDto} from "../schedule/dto/search-visits.dto";
import {TeamRoles} from "../shared/teamRoles";
import {CompetitionService} from "../competition/competition.service";
import {User} from "../users/entities/user.entity";
import {TeamSemesterVisits} from "../teams/entities/team-semester-visits.entity";
import {SearchStandardDto} from "../competition/dto/search-standard.dto";
import {Semester} from "../schedule/entities/semester.entity";
import {GeneralService} from "../general/general.service";
import {convertValueToPoint} from "./functions/functions";
import {Dictionary} from "../general/entities/dictionary.entity";

export interface Participant {
    [idUser: number]: {
        user: User,
        days: { [day: string]: string | boolean },
        counter: number
    }
}

export interface IUserVisits {
    [userId: number]: {
        percents: number,
        visits: number,
    }
}

export interface IUserAvgPoints {
    [userId: number]: {
        avgStart: number,
        avgEnd: number
    }
}


@Injectable()
export class UploadsService {

    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly competitionService: CompetitionService,
        @Inject(forwardRef(() => TeamsService))
        private readonly teamService: TeamsService,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        private readonly dictionaryService: GeneralService,
    ) {
    }

    pathToSave = 'public/media';

    // загрузить файл на сервер по указанному началу пути юрл
    async uploadFile(startPathUrl: string, file: Buffer, formatFile: string) {
        let fullPath = '';
        let fullURL = '';
        // если буфер не пустой
        if (file.buffer != null) {
            // сгенерировать уникальное имя
            let filename = this.generateUniqueFileName();

            const currentDate = new Date(); // Use the current date
            // сгенерировать путь к папке (год, месяц)
            const pathToFolder = this.generateFoldersYearMonthDay(
                currentDate,
                `./${this.pathToSave}`,
            );

            filename += `.${formatFile}`;
            fullPath = `./${this.pathToSave}/${pathToFolder}/${filename}`;
            fullURL = `${startPathUrl}/${this.pathToSave}/${pathToFolder}/${filename}`;

            const stream = createWriteStream(fullPath);
            stream.write(file);
            stream.end();
        } else {
            throw new HttpException('Буфер файла пустой', HttpStatus.BAD_REQUEST);
        }

        return fullURL;
    }

    // generators---------------------------------------------------------------------------------
    //генерирует уникальное имя для файла на основе даты
    private generateUniqueFileName() {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string of 6 characters

        return `${timestamp}_${randomString}`;
    }

    // сгенерировать папку год.месяц и подпапку дня
    private generateFoldersYearMonthDay(date: Date, pathStart: string) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month ranges from 0 to 11, so add 1 and pad with leading zero if necessary
        const folderDay = date.getDate().toString().padStart(2, '0'); // Pad day with leading zero if necessary

        const folderYearMonth = `${year}.${month}`;
        const pathToFolderDay = `${folderYearMonth}/${folderDay}`;

        this.createFolderIfNotExists(`${pathStart}/${folderYearMonth}`);

        const fullpath = `${pathStart}/${pathToFolderDay}`;

        this.createFolderIfNotExists(fullpath);

        return pathToFolderDay;
    }

    // проверить существование папки и создать, если не существует
    private createFolderIfNotExists(path: string) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
            console.log(`Folder created: ${path}`);
            return true;
        } else {
            return false;
        }
    }

    // generators---------------------------------------------------------------------------------

    //загрузить изображение
    async uploadImage(startPathUrl: string, file: Buffer) {
        const imgFormatTo = 'webp';
        const compressedImg = await this.convertImgToWebp(file, 600, 300);
        return await this.uploadFile(startPathUrl, compressedImg, imgFormatTo);
    }

    async convertImgToWebp(
        buffer: Buffer,
        width: number,
        height: number,
    ): Promise<Buffer> {
        return await sharp(buffer)
            .toFormat('webp') // Convert to WebP format
            .resize(width, height, {
                fit: 'inside', // Maintain aspect ratio and fit within the specified dimensions
                withoutEnlargement: true, // Do not enlarge the image if smaller than the target size
            })
            .toBuffer();
    }

    async deleteFileByUrl(pathURL: string) {
        const startPath = '/public/media';
        const deleted = true;
        let httpError: HttpException = null;

        try {
            const url = new URL(pathURL);

            const pathServer = `.${url.pathname}`;

            // need check correct path for preventing some bad api requests
            if (url.pathname.startsWith(startPath)) {
                await new Promise<void>((resolve, reject) => {
                    fs.unlink(pathServer, (err) => {
                        if (err) {
                            // console.error('Error deleting file:');
                            reject(err);
                        } else {
                            // console.log('File deleted successfully.');
                            resolve();
                        }
                    });
                });
            } else {
                httpError = new HttpException(
                    'Ошибка удаления файла, путь для удаления с сервера должен начинаться с ' +
                    startPath,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (error) {
            httpError = new HttpException(error.code, HttpStatus.BAD_REQUEST, {
                cause: new Error('Неверно введен URL'),
            });
        }

        if (httpError) throw httpError;

        return deleted;
    }

    async getFileBuffer(path: string) {
        let buffer: Buffer = null;
        // проверить существование файла
        if (fs.existsSync(path)) {
            buffer = fs.readFileSync(path);
        } else {
            throw new HttpException('Путь не найден', HttpStatus.BAD_REQUEST);
        }

        return buffer;
    }


    async getReportTeamVisits(res: Response, dto: SearchVisitsDto) {

        const teamVisits = await this.scheduleService.findTeamVisits(dto);
        const teamUsers = await this.teamService.teamWithUsers(dto.team_id, {});
        const semester = await this.scheduleService.findSemester(dto.semester_id)
        const schedule = await this.scheduleService.findSchedule(dto)

        const maxVisits = await this.teamService.findMaxVisits(dto)

        // get all dates of classes
        const dates: Date[] = []

        const workbook = new Workbook();

        // worksheet.getRow(1).font = {bold: true};
        const monthNamesInRussian = [
            "Январь",  // January
            "Февраль", // February
            "Март",    // March
            "Апрель",  // April
            "Май",     // May
            "Июнь",    // June
            "Июль",    // July
            "Август",  // August
            "Сентябрь",// September
            "Октябрь", // October
            "Ноябрь",  // November
            "Декабрь"  // December
        ];

        // get dates of classes
        schedule.cabinets_time.forEach((cab) => {
            if (cab.repeat) {
                // Define the start date and the maximum date

                const currentYear = new Date().getFullYear()
                const year = (schedule.team?.creation_date?.getFullYear() + semester.value/2)

                // console.log( currentYear, year, schedule.team?.creation_date.toLocaleDateString(), schedule.team?.creation_date?.getFullYear() )
                let startDate = new Date(year, semester.date_start.getMonth(), cab.date.getDay());

                let maxDate = new Date(year, semester.date_end.getMonth(), semester.date_end.getDay());
                // console.log("startDate", startDate.toLocaleDateString(),maxDate.toLocaleDateString(), cab.date.toLocaleDateString())

                // Loop until reaching the maximum date
                while (startDate < maxDate) {
                    // Do something with the current date
                    startDate.setHours(0, 0, 0, 0)
                    dates.push(new Date(startDate))
                    // Move to the next week
                    startDate.setDate(startDate.getDate() + 7);
                }
            } else {
                cab.date.setHours(0, 0, 0, 0)
                dates.push(new Date(cab.date))
            }
        })
        // Step 1: Sort the dates
        dates.sort((a, b) => a.getTime() - b.getTime());
        // Step 2: Format each date and remove duplicates
        const uniqueFormattedDates: { formattedDate: string, realDate: Date }[] = [];
        const formattedDates = new Set<string>();
        dates.forEach(date => {
            const formattedDate = this.formatDate(date);
            if (!formattedDates.has(formattedDate)) {
                formattedDates.add(formattedDate);
                uniqueFormattedDates.push({formattedDate: formattedDate, realDate: date});
            }
        });

        const months = new Set<number>()
        let headers = [{header: 'участник', key: 'name', width: 25}]

        uniqueFormattedDates.forEach((date, index) => {
            const month = date.realDate.getMonth()
            if (!months.has(month) || index == uniqueFormattedDates.length - 1) {
                let sheet: Worksheet
                // add new sheet
                // console.log("m", month, " ru ", monthNamesInRussian[month], monthNamesInRussian[month - 1])
                if (index != uniqueFormattedDates.length - 1) {

                    months.add(month)
                    workbook.addWorksheet(monthNamesInRussian[month]);
                    sheet = workbook.getWorksheet(monthNamesInRussian[month - 1]);
                    // console.log("here", sheet, workbook)
                    //  get existing sheet
                } else {
                    sheet = workbook.getWorksheet(monthNamesInRussian[month]);
                }
                // add headers if there is months added
                if (months.size > 0) {
                    headers.push({header: "нормативы(начало/конец семестра)", key: 'standards', width: 10})
                    headers.push({header: "посещения", key: 'visits', width: 10})

                   if(sheet) sheet.columns = headers
                }
                headers = [{header: 'участник', key: 'name', width: 25}]
            }
            headers.push({header: date.formattedDate, key: 'date' + index, width: 10})
        })

        // Format the dates and print them
        console.log("formattedDates", uniqueFormattedDates)


        const userVisits: Participant = {};
        // users of team
        teamUsers[0].forEach((userFunction) => {
            const tUser = userFunction.user

            if (tUser?.id && userFunction.function?.title != TeamRoles.Leader && userFunction?.user)
                userVisits[tUser.id] = {user: userFunction.user, days: {}, counter: 0}

            teamVisits[0].forEach((visit) => {
                const usrVisit = visit.user
                // console.log("userVisits",usrVisit.id == tUser?.id , usrVisit.id, tUser?.id, userFunction)
                if (tUser?.id && userFunction.function?.title != TeamRoles.Leader) {
                    // insert new user in list
                    if (usrVisit.id == tUser?.id) {
                        // insert dates in user
                        const d = this.formatDate(new Date(visit.date_visit))
                        userVisits[tUser.id].days[d] = visit.status_visit

                        if (visit.status_visit) userVisits[tUser.id].counter += 1
                    }
                }
            })
        })

        const compVisits = await this.getVisitsWithCompetitions(semester.date_start, userVisits, dto, maxVisits)
        const standards = await this.getUsersStandards(semester, userVisits, dto)

        let indexRow = 0
        for (const userId in userVisits) {
            if (userVisits.hasOwnProperty(userId)) {
                const participant = userVisits[userId];
                let data: any[] = [
                    participant.user.fullname ?? '-',
                ]

                const months = new Set<number>()

                uniqueFormattedDates.forEach((date, index) => {
                    const visitedDay = participant.days[date.formattedDate]
                    const month = date.realDate.getMonth()
                    // console.log("month", month, " date ", date.formattedDate, date.realDate.toLocaleDateString(), " fffff ", data)

                    if (!months.has(month) || index == uniqueFormattedDates.length - 1) {
                        let m = month
                        if (index != uniqueFormattedDates.length - 1) {
                            m -= 1
                        }

                        if (months.size > 0) {
                            const compV = compVisits[userId]
                            data.push((`${standards[userId]?.avgStart}/${standards[userId]?.avgEnd}`))
                            data.push((`${compV?.percents}%, ${compV?.visits} (${participant.counter}) из ${maxVisits.max_visits}`))

                            const sheet = workbook.getWorksheet(monthNamesInRussian[m]);
                            sheet.getRow(indexRow).getCell(1).alignment = {wrapText: true};
                            // addition data
                            sheet.addRow(data);
                            data = [participant.user.fullname ?? '-',]
                        }
                        data.push(visitedDay ? "+" : "")
                        months.add(month)
                    } else {
                        data.push(visitedDay ? "+" : "")
                    }
                })
            }
            indexRow++
        }

        await workbook.xlsx.write(res);
        res.end();
    }

    private formatDate(date: Date) {
        const day = `0${date.getDate()}`.slice(-2);
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }


    async getVisitsWithCompetitions(dateStart: Date, userVisits: Participant, dto: SearchVisitsDto, maxVisits: TeamSemesterVisits) {

        const userCompetitions: User[] = await this.getUserCompetitions(dateStart, userVisits)
        let usrVisitsTemp: IUserVisits = {}
        // console.log(userCompetitions[0].user_competition)
        // сколько 1 визит в процентах
        let onePerVisit = 100 / maxVisits.max_visits
        // gp through visits
        for (let key in userVisits) {

            let uV = userVisits[key]
            if (uV.user.id) {

                usrVisitsTemp[uV.user.id] = {percents: Math.round(onePerVisit * uV.counter), visits: uV.counter}
                // competitions users
                userCompetitions.forEach((userComp) => {
                        const usrId = userComp.id
                        if (usrId && uV.user.id == usrId) {
                            // visited only train days
                            let visits = userVisits[usrId].counter
                            let sumCompVisitsPercents = 0

                            // competition
                            userComp.user_competition?.forEach((competition) => {
                                const dS = new Date(competition.competition?.date_start ?? 0)
                                const dE = new Date(competition.competition?.date_end ?? 0)
                                const percentsVisits = this.datesCompetInPercents(dS, dE)
                                sumCompVisitsPercents += percentsVisits
                            })

                            // получить соревнования проценты с ограничением 20%
                            let competitionPercents = Math.min(sumCompVisitsPercents, 20)
                            // перевести соревнования из процентов в посещения
                            let competitionInVisits = Math.round(competitionPercents / onePerVisit)
                            // console.log("competitionInVisits", props.maxVisits, onePerVisit, competitionInVisits,
                            //     competitionPercents, sumCompVisitsPercents)

                            // сложить посещения и участия в соревнованиях
                            let visitedWithCompetition = Math.round(visits + competitionInVisits)
                            usrVisitsTemp[usrId] = {
                                percents: Math.round(onePerVisit * visitedWithCompetition),
                                visits: visitedWithCompetition
                            }
                        }

                    }
                )
            }
        }

        // console.log("usrVisitsTemp", usrVisitsTemp)

        return usrVisitsTemp
    }

    async getUserCompetitions(dateStart: Date, userVisits: Participant) {
        const currentYear = dateStart.getFullYear()
        const startOfYear = new Date(currentYear, new Date(dateStart ?? 0).getMonth(),
            new Date(dateStart ?? 1).getDate())

        let usrIds = Object.keys(userVisits).map(Number);
        return await this.competitionService.findAllCompetitions({
            user_ids: usrIds,
            date_start: startOfYear.toDateString()
        })
    }


    datesCompetInPercents(dateStart: Date, dateEnd: Date) {
        let t = dateEnd.getTime() - dateStart.getTime()
        let days = t / (1000 * 60 * 60 * 24)
        // in percents +1 (include start date)
        return (days + 1) * 3
    }


    // TODO: this is from client side
    private async getUsersStandards(semester: Semester, userVisits: Participant, dto: SearchVisitsDto,) {
        let usrIds = Object.keys(userVisits).map(Number);

        const uS: SearchStandardDto = {
            user_ids: usrIds,
            semestersRange: [semester.value - 1, semester.value],
            team_id: dto.team_id,
        }

        const usersStandards: User[] = await this.competitionService.findAllStandards(uS)

        const standardsNames: Dictionary[] = await this.dictionaryService.findAll({class_id: 8})

        const dataStandard: IUserAvgPoints = {}

        // go throught each user
        usersStandards.forEach((user) => {
            let sumPointsStart = 0
            let sumPointsEnd = 0
            const userId = user?.id

            if (userId) {
                dataStandard[userId] = {avgStart: 0, avgEnd: 0}

                // in each standard
                standardsNames.forEach((standard) => {

                    // go throught each user value standard
                    user?.standard_user?.forEach((userStandard) => {

                        if (standard.id == userStandard.standard?.id && userStandard?.semester && userStandard.value) {
                            // console.log(user.fullname, "userStandard val ", userStandard.value, "sem ", userStandard?.semester, "semester.value", semester.value?.semester )
                            // start
                            if (semester?.value && userStandard?.semester < semester?.value) {
                                sumPointsStart += convertValueToPoint(standard.name, userStandard.value)
                                // end
                            } else {
                                sumPointsEnd += convertValueToPoint(standard.name, userStandard.value)
                            }
                        }
                    })
                })
                // console.log("end", sumPointsStart, sumPointsEnd)
                dataStandard[userId].avgStart = sumPointsStart / standardsNames.length
                dataStandard[userId].avgEnd = sumPointsEnd / standardsNames.length
            }
        })

        return dataStandard
    }

}
