import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '../teams/entities/team.entity';
import { TeamsService } from '../teams/teams.service';
import { Requisitions } from '../teams/entities/requisition.entity';
import { Dictionary } from '../general/entities/dictionary.entity';
import { Form } from '../forms/entities/form.entity';
import { RequisitionFields } from '../forms/entities/requisition_fields.entity';
import { FormField } from '../forms/entities/form_field.entity';
import { GeneralService } from '../general/general.service';
import { FormsService } from '../forms/forms.service';
import { TeamPhoto } from '../teams/entities/team-photo.entity';
import { UploadsService } from '../uploads/uploads.service';
import { AccountsController } from './accounts.controller';
import { User } from '../users/entities/user.entity';
import { UserFunction } from '../users/entities/user_function.entity';
import { TeamFunction } from '../users/entities/function.entity';
import { Achievement } from '../users/entities/achievement.entity';
import { UsersService } from '../users/users.service';
import {TeamSemesterVisits} from "../teams/entities/team-semester-visits.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserFunction,
      TeamFunction,
      Team,
      Achievement,
      Requisitions,
      Function,
      TeamPhoto,
      TeamSemesterVisits,

      Form,
      Dictionary,
      FormField,

      RequisitionFields,
    ]),
  ],
  controllers: [AccountsController],
  providers: [
    UsersService,
    TeamsService,
    GeneralService,
    FormsService,
    UploadsService,
  ],
  exports: [UsersService],
})
export class AccountsModule {}
