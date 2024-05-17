import {Controller, ForbiddenException, Get, Post, Query, UseGuards} from '@nestjs/common';
import {CompetitionService} from './competition.service';
import {SearchCompetitionDto} from "./dto/search-competition.dto";
import {SearchStandardDto} from "./dto/search-standard.dto";
import {CreateStandardDto} from "./dto/create-standard.dto";
import {TeamPermissions} from "../shared/teamPermissions";
import {Permissions} from "../shared/permissions";
import {UserDecorator} from "../shared/user.decorator";
import {User} from "../users/entities/user.entity";
import {LocalAuthGuard} from "../users/guard/local-auth.guard";
import {UsersService} from "../users/users.service";

@Controller('competition')
export class CompetitionController {
    constructor(private readonly competitionService: CompetitionService,
                private readonly usersService: UsersService,) {
    }

    @Get()
    async findAllCompetitions(@Query() dto: SearchCompetitionDto) {
        return await this.competitionService.findAllCompetitions(dto);
    }

// --------------------------------------------------------------------------------------------------------------
// standard
// --------------------------------------------------------------------------------------------------------------

    @Get("standard")
    async findAllStandards(@Query() dto: SearchStandardDto) {
        return await this.competitionService.findAllStandards(dto);
    }

    @Post("standard")
    @UseGuards(LocalAuthGuard) // определяет авторизован ли пользователь
    async createOrUpdateStandard(
        @UserDecorator() user: User,
        @Query() dto: CreateStandardDto) {

        const hasPermissions = await this.usersService.hasPermissionsSystemOrTeam(
            user,
            dto.team_id,
            [TeamPermissions.SPECIAL],
            [Permissions.CAN_CREATE_TEAMS],
        );

        if (hasPermissions) {
            return await this.competitionService.createOrUpdateStandard(dto);
        } else
            throw new ForbiddenException(
                'Вы имеете недостаточно прав в коллективе, обратитесь к руководителю',
            );
    }
}
