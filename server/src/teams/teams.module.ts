import {Module} from '@nestjs/common';
import {TeamsService} from './teams.service';
import {TeamsController} from './teams.controller';
import {Team} from './entities/team.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../users/entities/user.entity';
import {UserFunction} from '../users/entities/user_function.entity';
import {TeamFunction} from '../users/entities/function.entity';
import {UsersService} from '../users/users.service';
import {UploadsService} from '../uploads/uploads.service';
import {Requisitions} from './entities/requisition.entity';
import {Dictionary} from '../general/entities/dictionary.entity';
import {GeneralService} from '../general/general.service';
import {Form} from '../forms/entities/form.entity';
import {RequisitionFields} from 'src/forms/entities/requisition_fields.entity';
import {FormField} from 'src/forms/entities/form_field.entity';
import {FormsService} from 'src/forms/forms.service';
import {TeamPhoto} from './entities/team-photo.entity';
import {Semester} from "../schedule/entities/semester.entity";
import {TeamSemesterVisits} from "./entities/team-semester-visits.entity";
import {ScheduleService} from "../schedule/schedule.service";
import {TeamSchedule} from "../schedule/entities/schedule.entity";
import {TeamVisits} from "../schedule/entities/team_visits.entity";
import {Cabinets} from "../schedule/entities/cabinets.entity";
import {CabinetsTime} from "../schedule/entities/cabinets-time.entity";
import {StandardUser} from "../competition/entities/standard-user.entity";
import {UserCompetition} from "../competition/entities/user-competition.entity";
import {CompetitionService} from "../competition/competition.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Team,
            User,
            UserFunction,
            TeamFunction,
            Requisitions,
            Dictionary,
            Form,
            TeamSemesterVisits,
            RequisitionFields,
            FormField,
            TeamPhoto,

            StandardUser,
            UserCompetition,

            TeamSchedule,
            TeamVisits,
            CabinetsTime,
            Cabinets,
            Semester
        ]),
    ],
    controllers: [TeamsController],
    providers: [
        TeamsService,
        UsersService,
        CompetitionService,
        ScheduleService,
        UploadsService,
        GeneralService,
        FormsService,
    ],
    exports: [TeamsService],
})
export class TeamsModule {
}
