import {Module} from '@nestjs/common';
import {CompetitionService} from './competition.service';
import {CompetitionController} from './competition.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Team} from "../teams/entities/team.entity";
import {User} from "../users/entities/user.entity";
import {UserFunction} from "../users/entities/user_function.entity";
import {TeamFunction} from "../users/entities/function.entity";
import {Requisitions} from "../teams/entities/requisition.entity";
import {Dictionary} from "../general/entities/dictionary.entity";
import {Form} from "../forms/entities/form.entity";
import {RequisitionFields} from "../forms/entities/requisition_fields.entity";
import {FormField} from "../forms/entities/form_field.entity";
import {TeamPhoto} from "../teams/entities/team-photo.entity";
import {Competition} from "./entities/competition.entity";
import {UserCompetition} from "./entities/user-competition.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Competition,
            UserCompetition
        ]),
    ],
    controllers: [CompetitionController],
    providers: [CompetitionService]
})
export class CompetitionModule {
}
