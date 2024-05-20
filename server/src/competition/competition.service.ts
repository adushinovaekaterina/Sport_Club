import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {EntityManager, Repository} from "typeorm";
import {UserCompetition} from "./entities/user-competition.entity";
import {SearchCompetitionDto} from "./dto/search-competition.dto";
import {SearchStandardDto} from "./dto/search-standard.dto";
import {StandardUserEntity} from "./entities/standard-user.entity";
import {CreateStandardDto} from "./dto/create-standard.dto";
import {UsersService} from "../users/users.service";
import {GeneralService} from "../general/general.service";
import {TeamSchedule} from "../schedule/entities/schedule.entity";
import {Team} from "../teams/entities/team.entity";

@Injectable()
export class CompetitionService {

    constructor(
        @InjectRepository(UserCompetition)
        private readonly userCompetitionRepository: Repository<UserCompetition>,
        @InjectRepository(StandardUserEntity)
        private readonly standardUserRepository: Repository<StandardUserEntity>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly dictionaryService: GeneralService,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) {
    }

    async findAllCompetitions(dto: SearchCompetitionDto) {
        const query = this.userCompetitionRepository
            .createQueryBuilder('user_competition')
            .leftJoinAndSelect('user_competition.competition', 'competition')
            .leftJoinAndSelect('user_competition.user', 'user')
            .leftJoinAndSelect('competition.level', 'level')

        // user_id
        dto.user_id ? query.andWhere('user.id = :user', {user: dto.user_id}) : null

        return await query.getMany();
    }

    async findAllStandards(dto: SearchStandardDto) {

        const query = this.standardUserRepository
            .createQueryBuilder('standard_user')
            .leftJoinAndSelect('standard_user.standard', 'standard')
            .leftJoinAndSelect('standard_user.user', 'user')
            .leftJoinAndSelect('standard_user.team', 'team')

        // user_id
        dto.user_id ? query.andWhere('user.id = :user_id', {user_id: dto.user_id}) : null
        // standard_id
        dto.standard_id ? query.andWhere('standard.id = :standard_id', {standard_id: dto.standard_id}) : null
        // semester
        dto.semester ? query.andWhere('standard_user.semester = :semester', {semester: dto.semester}) : null
        // team_id
        dto.team_id ? query.andWhere('team.id = :team', {team: dto.team_id}) : null

        return await query.getMany();
    }

    async createOrUpdateStandard(dto: CreateStandardDto) {

        const existStandards = await this.findAllStandards({...dto})

        const existStandard = existStandards[0]

        let res = {message: ""}
        if (existStandard) {
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
            await this.standardUserRepository.insert({user: user, standard:standard, team:team, ...dto}).then(() => {
                res.message = "Сохранено"
            })
        }

        return res;
    }
}
