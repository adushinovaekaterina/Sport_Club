import {BadRequestException, Injectable, NotFoundException,} from '@nestjs/common';
import {SearchVisitsDto} from './dto/search-visits.dto';
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm';
import {EntityManager, Repository} from 'typeorm';
import {TeamSchedule} from './entities/schedule.entity';
import {UpdateVisitsDto} from './dto/update-visits.dto';
import {UsersService} from '../users/users.service';
import {TeamVisits} from './entities/visits.entity';
import {Cabinets} from './entities/cabinets.entity';
import {GetAllCabinetsResponse} from './dto/get-all-cabinets.response';
import {CreateCabinetDto} from './dto/create-cabinet.dto';
import {CreateCabinetResponse} from './dto/create-cabinet.response';
import {DeleteCabinetResponse} from './dto/delete-cabinet.response';
import {SearchCabinetsDto} from './dto/search-cabinets.dto';
import {SearchScheduleDto} from './dto/search-schedule.dto';
import {CreateCabinetTimeDto} from './dto/create-cabinet-time.dto';
import {CabinetsTime} from './entities/cabinets-time.entity';
import {Dictionary} from '../general/entities/dictionary.entity';
import {UpdateCabinetTimeDto} from './dto/update-cabinet-time.dto';
import {Team} from "../teams/entities/team.entity";
import {CreatSemesterDto} from "./dto/create-semester.dto";
import {Semester} from "./entities/semester.entity";
import {SearchSemesterDto} from "./dto/search-semester.dto";
import {CreateScheduleDto} from "./dto/create-schedule.dto";
import {User} from "../users/entities/user.entity";

@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(TeamSchedule) // user //,
        private readonly teamSchedRepository: Repository<TeamSchedule>,
        @InjectRepository(TeamVisits) // user //,
        private readonly teamVisitsRepository: Repository<TeamVisits>,
        @InjectRepository(Cabinets)
        private readonly cabinetsRepository: Repository<Cabinets>,
        @InjectRepository(CabinetsTime)
        private readonly cabinetsTimeRepository: Repository<CabinetsTime>,
        @InjectRepository(Dictionary)
        private readonly dictionaryRepository: Repository<Dictionary>,
        private readonly usersService: UsersService,
        @InjectRepository(Semester)
        private readonly semesterRepository: Repository<Semester>,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) {
    }

    // --------------------------------------------------------------------------------------------------------------
    // schedule
    // --------------------------------------------------------------------------------------------------------------

    public async createSchedule(user: User, dto: CreateScheduleDto) {
        const team = await this.entityManager.findOneBy(Team, {id: dto.team_id})
        const semester = await this.entityManager.findOneBy(Semester, {id: dto.semester_id})
        const u = await this.entityManager.findOneBy(User, {id: user.userId})

        return await this.teamSchedRepository.save(
            {team: team, semester: semester, user: u})
    }


    async findScheduleById(id: number) {
        return await this.teamSchedRepository.findOneBy({id: id})
    }

    async findSchedule(searchScheduleDto: SearchScheduleDto) {
        const query = this.teamSchedRepository
            .createQueryBuilder('team_schedule')
            .select(['team_schedule.id', 'user.id', 'user.fullname'])
            .leftJoin('team_schedule.team', 'team')
            // cabinets_time
            .leftJoinAndSelect('team_schedule.cabinets_time', 'cabinets_time')
            .leftJoinAndSelect('cabinets_time.day_week', 'day_week')
            .leftJoinAndSelect('cabinets_time.cabinet', 'cabinet')
            .leftJoinAndSelect('team_schedule.semester', 'semester')

            .leftJoin('cabinets_time.user', 'user');

        // team_id
        searchScheduleDto.team_id
            ? query.andWhere('team.id = :team_id', {team_id: searchScheduleDto.team_id})
            : query;

        // semester_id
        searchScheduleDto.semester_id
            ? query.andWhere('semester.id = :semester_id', {semester_id: searchScheduleDto.semester_id})
            : query;

        // day_week_id
        searchScheduleDto.day_week_id
            ? query.andWhere('day_week.id = :day_week_id', {
                day_week_id: searchScheduleDto.day_week_id,
            })
            : query;

        // time_start
        searchScheduleDto.time_start
            ? query.andWhere('cabinets_time.time_start >= :time_start', {
                time_start: searchScheduleDto.time_start,
            })
            : query;

        // time_end
        searchScheduleDto.time_end
            ? query.andWhere('cabinets_time.time_end <= :time_end', {
                time_end: searchScheduleDto.time_end,
            })
            : query;

        return await query.orderBy('cabinets_time.time_start', 'ASC').getOne();
    }

    // --------------------------------------------------------------------------------------------------------------
    // visits
    // --------------------------------------------------------------------------------------------------------------

    async findVisits(searchVisitsDto: SearchVisitsDto) {
        const res = this.teamVisitsRepository
            .createQueryBuilder('team_visits')
            .select([
                'user.id',
                'user.fullname',
                'user.education_group',
                'team_visits.id',
                'team_visits.status_visit',
                'team_visits.date_visit',
            ])
            .leftJoin('team_visits.team', 'team')
            // .leftJoin('team_schedule.team_visits', 'team_visits')
            .leftJoin('team_visits.user', 'user')
            .where('team.id = :team_id', {team_id: searchVisitsDto.team_id})
            .andWhere(
                'team_visits.date_visit >= :date_start and team_visits.date_visit <= :date_end',
                {
                    date_start: new Date(searchVisitsDto.date_visit_start),
                    date_end: new Date(searchVisitsDto.date_visit_end),
                },
            );

        return await res.getManyAndCount();
    }

    async updateVisit(updateVisitsDto: UpdateVisitsDto) {
        let res;

        const existingVisit = await this.teamVisitsRepository
            .createQueryBuilder('team_visits')
            .leftJoin('team_visits.team', 'team')
            .leftJoin('team_visits.user', 'user')
            .where('team.id = :team_id', {team_id: updateVisitsDto.team_id})
            .andWhere('team_visits.date_visit = :date_visit', {
                date_visit: new Date(updateVisitsDto.date_visit),
            })
            .andWhere('user.id = :user_id', {
                user_id: updateVisitsDto.user_id,
            })
            .getOne();
        // console.log(existingVisit)
        // existing Visit
        if (existingVisit) {
            res = this.teamVisitsRepository.update(existingVisit.id, {
                status_visit: updateVisitsDto.status_visit,
                comment: updateVisitsDto.comment,
            });
        } else {
            const user = await this.usersService.findOne(updateVisitsDto.user_id);
            const team = await this.entityManager.findOneBy(Team, {id: updateVisitsDto.team_id});

            res = this.teamVisitsRepository.insert({
                user: user,
                status_visit: updateVisitsDto.status_visit,
                date_visit: updateVisitsDto.date_visit,
                team: team,
                comment: updateVisitsDto.comment,
            });
        }

        return res;
    }

    public async getAllCabinets(
        searchCabinetsDto: SearchCabinetsDto,
    ): Promise<GetAllCabinetsResponse> {
        const query = this.cabinetsRepository
            .createQueryBuilder('cabinets')
            .leftJoinAndSelect('cabinets.cabinets_time', 'cabinets_time')
            .leftJoinAndSelect('cabinets_time.day_week', 'day_week');

        // find cabinets by ids
        searchCabinetsDto.ids
            ? query.where('cabinets.id IN (:...ids)', {
                ids: searchCabinetsDto.ids,
            })
            : null;

        // tags
        searchCabinetsDto.tag
            ? query.where(":tag = ANY(string_to_array(cabinets.tags, ','))", {
                tag: searchCabinetsDto.tag,
            })
            : null;

        const cabinets = await query
            .orderBy('cabinets.name', 'ASC')
            .getManyAndCount();

        return {
            cabinets: cabinets[0],
            count: cabinets[1],
        };
    }

    public async createCabinet(
        dto: CreateCabinetDto,
    ): Promise<CreateCabinetResponse> {
        const newCabinet = await this.cabinetsRepository.save(dto);

        return {
            cabinet: newCabinet,
        };
    }

    public async deleteCabinet(id: number): Promise<DeleteCabinetResponse> {
        const result = await this.cabinetsRepository.delete(id);
        const message = 'Кабинет успешно удален';

        if (result.affected === 0) {
            throw new NotFoundException(`Кабинет не найден!`);
        }

        return {message};
    }

    public async createCabinetTime(user: User, dto: CreateCabinetTimeDto) {
        const daysOfWeek = [
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота',
        ];

        const date = new Date(dto.date);
        const week = daysOfWeek[date.getDay()];

        try {
            let cabinet = null
            if (dto.id_cabinet)
                cabinet = await this.cabinetsRepository.findOneBy({
                    id: dto.id_cabinet,
                });

            let teamSchedule: TeamSchedule
            // if we have id team schedule
            if (dto.id_team_schedule) {
                teamSchedule = await this.findScheduleById(dto.id_team_schedule)
                //  team_id and semester_id
            } else {
                teamSchedule = await this.findSchedule({team_id: dto.team_id, semester_id: dto.semester_id})
            }

            console.log("ex ", teamSchedule, " dto ", dto, " id_team_schedule ", dto.id_team_schedule)

            // if team schedule not found create new on base existing from prev semester
            if (!teamSchedule) {
                teamSchedule = await this.createScheduleOnBaseExisting(user, dto.team_id, dto.semester_id, 1)
            }

            let leader = null
            if (dto.user_id) leader = await this.usersService.findOne(dto.user_id);

            const dayWeek = await this.dictionaryRepository.findOneBy({
                name: week,
                class_id: 7,
            });

            return await this.cabinetsTimeRepository.save({
                ...dto,
                user: leader,
                cabinet: cabinet,
                team_schedule: teamSchedule,
                day_week: dayWeek,
            });
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    private async createScheduleOnBaseExisting(user: User, teamId: number, semesterId: number, semesterValPrevSched: number) {
        // find schedule by semester 1
        let existingShed = await this.findSchedule({
            team_id: teamId,
            semester_value: semesterValPrevSched
        })

        // create new schedule
        const newShed = await this.createSchedule(user, {
            team_id: teamId,
            semester_id: semesterId
        })

        const cabinetsTime = existingShed?.cabinets_time ?? []
        // set new schedule for cabinets
        cabinetsTime.forEach(cab => {
            cab.team_schedule = newShed;
        });

        console.log(newShed, cabinetsTime)
        // create cabinets
        await this.cabinetsTimeRepository.insert(cabinetsTime)

        return newShed
    }

    public async deleteCabinetTime(id: number) {
        const result = await this.cabinetsTimeRepository.delete(id);
        const message = 'Кабинет успешно удален';

        if (result.affected === 0) {
            throw new NotFoundException(`Кабинет не найден!`);
        }

        return {message: message};
    }

    public async updateCabinetTime(id: number, dto: UpdateCabinetTimeDto) {
        const cabinet = await this.cabinetsRepository.findOneBy({
            id: dto.id_cabinet,
        });
        const dayWeek = await this.dictionaryRepository.findOneBy({
            id: dto.id_day_week,
        });

        const result = await this.cabinetsTimeRepository.update(id, {
            time_start: dto.time_start,
            time_end: dto.time_end,
            repeat: dto.repeat,
            cabinet: cabinet,
            day_week: dayWeek,
        });
        const message = 'Кабинет успешно обновлен';

        if (result.affected === 0) {
            throw new NotFoundException(`Кабинет не найден!`);
        }

        return {message: message};
    }

    // --------------------------------------------------------------------------------------------------------------
    // semester
    // --------------------------------------------------------------------------------------------------------------

    async createOrUpdateSemester(createSemesterDto: CreatSemesterDto) {
        const existSemester = await this.semesterRepository.findOneBy({value: createSemesterDto.value});
        let msg: string
        if (existSemester) {
            await this.semesterRepository.update(existSemester.id, {...createSemesterDto});
        } else {
            await this.semesterRepository.insert({...createSemesterDto});
        }
        msg = "Сохранено"

        return {message: msg}
    }

    async findSemesters(searchSemesterDto: SearchSemesterDto) {
        const query = this.semesterRepository
            .createQueryBuilder('semester')

        // values
        searchSemesterDto.values
            ? query.where('semester.value IN (:...values)', {
                values: searchSemesterDto.values,
            })
            : null;

        return query.getMany()
    }

    async findSemester(id: number) {
        const query = this.semesterRepository
            .createQueryBuilder('semester')
            .where("semester.id = :id", {id: id})

        return query.getOne()
    }
}
