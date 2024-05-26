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
        return await query.getMany();
    }

    async findAllStandards(dto: SearchStandardDto) {

        const query = this.userRepository
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.standard_user', 'standard_user')
            .leftJoinAndSelect('standard_user.standard', 'standard')
            .leftJoin('standard_user.team', 'team')

        // user_id
        // dto.user_id ? query.andWhere('user.id = :user_id', {user_id: dto.user_id}) : null
        // standard_id
        dto.standard_id ? query.andWhere('standard.id = :standard_id', {standard_id: dto.standard_id}) : null
        // semesters
        dto.semesters && dto.semesters.length > 0
            ? query.andWhere('standard_user.semester in (:...semesters)', {
                semesters: dto.semesters,
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

        const sSDto:SearchStandardDto = {...dto, semesters: [dto.semester]}

        const existStandards = await this.findAllStandards(sSDto)

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
            await this.standardUserRepository.insert({user: user, standard: standard, team: team, ...dto}).then(() => {
                res.message = "Сохранено"
            })
        }

        return res;
    }
}
