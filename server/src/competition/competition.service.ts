import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserCompetition} from "./entities/user-competition.entity";
import {SearchCompetitionDto} from "./dto/search-competition.dto";

@Injectable()
export class CompetitionService {

    constructor(
        @InjectRepository(UserCompetition)
        private readonly userCompetitionRepository: Repository<UserCompetition>,
    ) {}

    async findAll(dto: SearchCompetitionDto) {
        const query = this.userCompetitionRepository
            .createQueryBuilder('user_competition')
            .leftJoinAndSelect('user_competition.competition', 'competition')
            .leftJoinAndSelect('user_competition.user', 'user')
            .leftJoinAndSelect('competition.level', 'level')

        // user_id
        dto.user_id ? query.andWhere('user.id = :user', {user: dto.user_id}) : null

        return await query.getMany();
    }
}
