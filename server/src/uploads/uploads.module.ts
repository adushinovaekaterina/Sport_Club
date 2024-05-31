import {Module} from '@nestjs/common';
import {UploadsService} from './uploads.service';
import {UploadsController} from './uploads.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Event} from 'src/events/entities/event.entity';
import {EventsService} from 'src/events/events.service';
import {Journal} from 'src/events/entities/journal.entity';
import {Dictionary} from 'src/general/entities/dictionary.entity';
import {GeneralService} from 'src/general/general.service';
import {TeamsService} from "../teams/teams.service";
import {ScheduleService} from "../schedule/schedule.service";
import {Team} from "../teams/entities/team.entity";
import {TeamSchedule} from "../schedule/entities/schedule.entity";
import {User} from "../users/entities/user.entity";
import {UserFunction} from "../users/entities/user_function.entity";
import {TeamFunction} from "../users/entities/function.entity";
import {Requisitions} from "../teams/entities/requisition.entity";
import {Form} from "../forms/entities/form.entity";
import {RequisitionFields} from "../forms/entities/requisition_fields.entity";
import {FormField} from "../forms/entities/form_field.entity";
import {TeamPhoto} from "../teams/entities/team-photo.entity";
import {Semester} from "../schedule/entities/semester.entity";
import {TeamSemesterVisits} from "../teams/entities/team-semester-visits.entity";
import {TeamVisits} from "../schedule/entities/team_visits.entity";
import {CabinetsTime} from "../schedule/entities/cabinets-time.entity";
import {Cabinets} from "../schedule/entities/cabinets.entity";
import {UsersService} from "../users/users.service";
import {FormsService} from "../forms/forms.service";

@Module({
    imports: [TypeOrmModule.forFeature([
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

        TeamSchedule,
        TeamVisits,
        CabinetsTime,
        Cabinets,])],
    controllers: [UploadsController],
    providers: [
        UploadsService,
        EventsService,
        GeneralService,
        UsersService,
        FormsService,
        TeamsService,
        ScheduleService],
    exports:[UploadsService]
})
export class UploadsModule {
}
