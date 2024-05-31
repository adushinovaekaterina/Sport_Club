import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import * as fs from 'fs';
import {createWriteStream} from 'fs';
import {Event} from 'src/events/entities/event.entity';
import {Workbook, Worksheet} from 'exceljs';
import {Response} from 'express';
import * as sharp from 'sharp';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";
import {ScheduleService} from "../schedule/schedule.service";
import {TeamsService} from "../teams/teams.service";
import {SearchVisitsDto} from "../schedule/dto/search-visits.dto";
import {UserFunction} from "../users/entities/user_function.entity";
import {TeamRoles} from "../shared/teamRoles";
import {CompetitionService} from "../competition/competition.service";
import {User} from "../users/entities/user.entity";
import {TeamVisits} from "../schedule/entities/team_visits.entity";
import {TeamSemesterVisits} from "../teams/entities/team-semester-visits.entity";

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


@Injectable()
export class UploadsService {

    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly competitionService: CompetitionService,
        @Inject(forwardRef(() => TeamsService))
        private readonly teamService: TeamsService,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
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

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    async getReportEvents(res: Response, events: Event[], countEvents: number) {
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'report_file.xlsx',
        );

        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('мероприятия');
        worksheet.columns = [
            {header: 'название', key: 'name', width: 25},
            {header: 'уровень', key: 'level', width: 15},
            {header: 'тип', key: 'type', width: 15},
            {header: 'формат', key: 'format', width: 15},
            {header: 'дата начала', key: 'startDate', width: 15},
            {header: 'дата конца', key: 'endDate', width: 15},
        ];

        worksheet.getRow(1).font = {bold: true};

        // Add some data to the worksheet

        let indexRow = 1;
        for (const i in events) {
            const e = events[i];
            const arrData = [];

            arrData.push(
                e.title ?? '-',
                e.level ? e.level.name : '-',
                e.type ? e.type.name : '-',
                e.format ? e.format.name : '-',
                e.dateStart,
                e.dateEnd,
            );

            worksheet.getRow(indexRow).getCell(1).alignment = {wrapText: true};
            worksheet.addRow(arrData);

            indexRow++;
        }

        await workbook.xlsx.write(res);
        res.end();
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
                const currentYear = new Date().getFullYear();

                let startDate = new Date(currentYear, 0, cab.date.getDay());
                console.log("startDate", startDate.toLocaleDateString(), cab.date.toLocaleDateString())

                let maxDate = new Date(currentYear, semester.date_end.getMonth(), semester.date_end.getDay());
                // Loop until reaching the maximum date
                while (startDate < maxDate) {
                    console.log("inner ", startDate.toLocaleDateString())

                    // Do something with the current date
                    // const formattedDate = formatDate(startDate)
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
                if (index != uniqueFormattedDates.length - 1) {
                    months.add(month)
                    workbook.addWorksheet(monthNamesInRussian[month]);
                    sheet = workbook.getWorksheet(monthNamesInRussian[month - 1]);
                    //  get existing sheet
                } else {
                    sheet = workbook.getWorksheet(monthNamesInRussian[month]);
                }
                // add headers if there is months added
                if (months.size > 0) {
                    headers.push({header: "посещения", key: 'visits' , width: 10})
                    sheet.columns = headers
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
                    data.push(visitedDay ? "+" : "")
                    const month = date.realDate.getMonth()

                    if (!months.has(month) || index == uniqueFormattedDates.length - 1) {
                        let m = month
                        if (index != uniqueFormattedDates.length - 1) {
                            m -= 1
                         }

                        if (months.size > 0) {
                            const sheet = workbook.getWorksheet(monthNamesInRussian[m]);
                            sheet.getRow(indexRow).getCell(1).alignment = {wrapText: true};
                            const compV = compVisits[userId]
                            data.push((`${compV?.percents}%, ${compV?.visits} (${participant.counter}) из ${maxVisits.max_visits}`))
                            sheet.addRow(data);
                             data = [participant.user.fullname ?? '-',]
                        }
                        months.add(month)
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


}
