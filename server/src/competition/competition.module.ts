import {Module} from '@nestjs/common';
import {CompetitionService} from './competition.service';
import {CompetitionController} from './competition.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Team} from "../teams/entities/team.entity";
import {User} from "../users/entities/user.entity";
import {UserFunction} from "../users/entities/user_function.entity";
import {TeamFunction} from "../users/entities/function.entity";
import {Dictionary} from "../general/entities/dictionary.entity";
import {Competition} from "./entities/competition.entity";
import {UserCompetition} from "./entities/user-competition.entity";
import {UsersService} from "../users/users.service";
import {GeneralService} from "../general/general.service";
import {StandardUser} from "./entities/standard-user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Competition,
            UserCompetition,
            StandardUser,
            User,
            Dictionary,
            UserFunction,
            TeamFunction,
            Team
        ]),
    ],
    controllers: [CompetitionController],
    providers: [CompetitionService, UsersService, GeneralService,]
})
export class CompetitionModule {
}
