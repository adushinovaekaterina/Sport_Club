import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import {UserFunction} from './entities/user_function.entity';
import {TeamFunction} from './entities/function.entity';
import {Team} from '../teams/entities/team.entity';
import {Achievement} from './entities/achievement.entity';
import {TeamsService} from '../teams/teams.service';
import {Requisitions} from '../teams/entities/requisition.entity';
import {Dictionary} from '../general/entities/dictionary.entity';
import {Form} from '../forms/entities/form.entity';
import {RequisitionFields} from '../forms/entities/requisition_fields.entity';
import {FormField} from '../forms/entities/form_field.entity';
import {GeneralService} from '../general/general.service';
import {FormsService} from '../forms/forms.service';
import {TeamPhoto} from '../teams/entities/team-photo.entity';
import {UploadsService} from '../uploads/uploads.service';
import {TeamSemesterVisits} from "../teams/entities/team-semester-visits.entity";
import {ScheduleService} from "../schedule/schedule.service";
import {TeamSchedule} from "../schedule/entities/schedule.entity";
import {TeamVisits} from "../schedule/entities/team_visits.entity";
import {Cabinets} from "../schedule/entities/cabinets.entity";
import {CabinetsTime} from "../schedule/entities/cabinets-time.entity";
import {Semester} from "../schedule/entities/semester.entity";
import {Event} from "../events/entities/event.entity";
import {Journal} from "../events/entities/journal.entity";
import {CompetitionService} from "../competition/competition.service";
import {StandardUser} from "../competition/entities/standard-user.entity";
import {UserCompetition} from "../competition/entities/user-competition.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Event,
            Journal,
            Dictionary,
            Team,
            TeamSchedule,
            User,
            UserFunction,
            TeamFunction,
            Requisitions,
            Dictionary,
            Form,
            RequisitionFields,
            FormField,
            TeamPhoto,
            Semester,
            TeamSemesterVisits,

            StandardUser,
            UserCompetition,


            TeamSchedule,
            TeamVisits,
            CabinetsTime,
            Cabinets,
        ]),
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
        TeamsService,
        GeneralService,
        CompetitionService,
        FormsService,
        ScheduleService,
        UploadsService,
    ],
    exports: [UsersService, TeamsService],
})
export class UsersModule {
}
