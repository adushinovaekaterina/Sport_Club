import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {EntityManager, Repository} from "typeorm";
import {UserCompetition} from "./entities/user-competition.entity";
import {SearchCompetitionDto} from "./dto/search-competition.dto";
import {SearchStandardDto} from "./dto/search-standard.dto";
import {CreateStandardDto} from "./dto/create-standard.dto";
import {UsersService} from "../users/users.service";
import {GeneralService} from "../general/general.service";
import {Team} from "../teams/entities/team.entity";
import {StandardUser} from "./entities/standard-user.entity";
import {User} from "../users/entities/user.entity";
import postgres from "postgres";


@Injectable()
export class CompetitionService {

    constructor(
        @InjectRepository(UserCompetition)
        private readonly userCompetitionRepository: Repository<UserCompetition>,
        @InjectRepository(StandardUser)
        private readonly standardUserRepository: Repository<StandardUser>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly dictionaryService: GeneralService,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) {
    }

    async findAllCompetitions(dto: SearchCompetitionDto) {
        const query = this.userRepository
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.user_competition', 'user_competition')
            .leftJoinAndSelect('user_competition.competition', 'competition')
            .leftJoinAndSelect('user_competition.user', 'user')
            .leftJoinAndSelect('competition.level', 'level')

        // user_ids
        dto.user_ids && dto.user_ids.length > 0
            ? query.andWhere('users.id in (:...user_ids)', {
                user_ids: dto.user_ids,
            })
            : query;
        // date_start
        dto.date_start ? query.andWhere('competition.date_start >= :date_start', {
            date_start: dto.date_start,
        }) : query;
        // date_end
        dto.date_end ? query.andWhere('competition.date_end <= :date_end', {
            date_end: dto.date_end,
        }) : query;
        return await query.getMany();
    }

    async findOneUserStandard(dto: CreateStandardDto) {
        // console.log(dto.standard_id, dto.user_id, dto.team_id)
        return await this.standardUserRepository
            .createQueryBuilder('standard_user')
            .leftJoinAndSelect('standard_user.standard', 'standard')
            .leftJoinAndSelect('standard_user.user', 'user')
            .leftJoin('standard_user.team', 'team')
            .where("standard.id = :standard_id", {standard_id: dto.standard_id})
            .andWhere("user.id = :user_id", {user_id: dto.user_id})
            .andWhere("team.id = :team_id", {team_id: dto.team_id})
            .andWhere("standard_user.semester = :semester_id", {semester_id: dto.semester})
            .getOne()

    }

    async findAllStandards(dto: SearchStandardDto) {

        const query = this.userRepository
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.standard_user', 'standard_user')
            .leftJoinAndSelect('standard_user.standard', 'standard')
            .leftJoin('standard_user.team', 'team')

        // standard_id
        dto.standard_id ? query.andWhere('standard.id = :standard_id', {standard_id: dto.standard_id}) : null
        // semesters
        dto.semesters && dto.semesters.length > 0
            ? query.andWhere('standard_user.semester in (:...semesters)', {
                semesters: dto.semesters,
            })
            : query;
        // semestersRange
        dto.semestersRange && dto.semestersRange.length > 1
            ? query.andWhere('standard_user.semester <= :semestersRangeEnd and standard_user.semester >= :semestersRangeStart', {
                semestersRangeStart: dto.semestersRange[0],
                semestersRangeEnd: dto.semestersRange[1],
            })
            : query;
        // user_ids
        dto.user_ids && dto.user_ids.length > 0
            ? query.andWhere('users.id in (:...user_ids)', {
                user_ids: dto.user_ids,
            })
            : query;
        // team_id
        dto.team_id ? query.andWhere('team.id = :team', {team: dto.team_id}) : null

        return await query.getMany();
    }

    async createOrUpdateStandard(dto: CreateStandardDto) {


        const existStandards = await this.findOneUserStandard(dto)
        const existStandard = existStandards

        let res = {message: ""}
        if (existStandard) {
            // console.log(existStandard, dto.value, existStandard.id)
            //  update
            await this.standardUserRepository.update(existStandard.id, {
                value: dto.value
            }).then(() => {
                res.message = "Обновлено"
            })
            //  create
        } else {
            const user = await this.usersService.findById(dto.user_id)
            const team = await this.entityManager.findOneBy(Team, {id: dto.team_id});

            const standard = await this.dictionaryService.findOne(dto.standard_id)
            await this.standardUserRepository.insert({user: user, standard: standard, team: team, ...dto}).then(() => {
                res.message = "Сохранено"
            })
        }

        return res;
    }
}
