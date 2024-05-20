import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Req,
    SetMetadata,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {TeamsService} from './teams.service';
import {CreateTeamDto} from './dto/create-team.dto';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags,} from '@nestjs/swagger';
import {Team} from './entities/team.entity';
import {UserFunction} from '../users/entities/user_function.entity';
import {UsersService} from '../users/users.service';
import {UpdateTeamDto} from './dto/update-team.dto';
import {UploadsService} from '../uploads/uploads.service';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import {SearchTeamDto} from './dto/search-team.dto';
import {Requisitions} from './entities/requisition.entity';
import {Request} from 'express';
import {FileImageValidationPipe} from 'src/uploads/validation/image_file.validation.pipe';
import {RequisitionDto} from './dto/uc-requisition.dto';
import {LocalAuthGuard} from 'src/users/guard/local-auth.guard';
import {PermissionsGuard} from 'src/users/guard/check-permissions.guard';
import {CreateRequisitionDto} from './dto/create-requisition.dto';
import {Permissions} from '../shared/permissions';
import {UserDecorator} from '../shared/user.decorator';
import {User} from '../users/entities/user.entity';
import {UserFunctionDto} from '../users/dto/user-functions.dto';
import {AssignDirectionTeamLeaderDto} from '../users/dto/direction-leader.dto';
import {TeamRoles} from '../shared/teamRoles';
import {TeamPermissions} from '../shared/teamPermissions';


@ApiTags('teams') //<---- Отдельная секция в Swagger для всех методов контроллера
@Controller('teams')
export class TeamsController {
    constructor(
        private readonly teamsService: TeamsService,
        private readonly usersService: UsersService,
        private readonly uploadsService: UploadsService,
    ) {
    }

    @Post(':id/max-visits')
    // определяет авторизован ли пользователь и какие у него разрешения
    async setMaxVisits(
        @UserDecorator() user: User,
        @Param('id') id: number,
        @Body() params: { max_visits: number },
    ) {
        return this.teamsService.setMaxVisits(id, params.max_visits);
    }

    @Get()
    @ApiOperation({summary: 'Получение списка коллективов с их руководителями'})
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно', type: [Team]})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    findAll(@Query() params: SearchTeamDto) {
        return this.teamsService.findAll(params);
    }

    @Get('of-direction')
    @ApiOperation({summary: 'Получение списка  коллективов направления'})
    @ApiParam({
        name: 'type_team',
        required: false,
        description: 'указать тип коллектива',
    })
    @ApiParam({
        name: 'id_parent',
        required: false,
        description: 'указать его родителя (если коллектив, то направление)',
    })
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно', type: [Team]})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    findAllTeamsOfDirection(@Query() params) {
        return this.teamsService.findAllTeamsOfDirection(params.id_parent);
    }

    @Get('directions')
    @ApiOperation({
        summary: 'отдает список направлений с юзерами которые за них отвечают',
    })
    @ApiParam({
        name: 'directions',
        required: true,
        description: 'Идентификатор ',
    })
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно', type: Team})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    findDirections(@Query() params) {
        return this.teamsService.findDirections(params.id_parent);
    }

    @Put(':id/archive')
    @UseGuards(LocalAuthGuard, PermissionsGuard)
    @SetMetadata('permissions', [Permissions.CAN_CREATE_TEAMS])
    @ApiOperation({summary: 'Архивировать коллектив или наоборот'})
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно'})
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request, какие то данные неверно введены',
    })
    changeArchiveTeam(
        @Param('id') id: number,
        @Body() data: { isArchive: boolean },
    ) {
        return this.teamsService.changeArchiveTeam(id, data.isArchive);
    }

    @Put(':id')
    @UseGuards(LocalAuthGuard)
    @ApiOperation({
        summary: 'Обновить коллектив (ответственный по направлению) и руководитель',
    })
    @ApiBody({
        description: 'название коллектива, ФИО руководителя, описание проекта',
        required: true,
    })
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно'})
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request, какие то данные неверно введены',
    })
    @UseInterceptors(FilesInterceptor('files'))
    async update(
        @UserDecorator() user: User,
        @Param('id') id: number,
        @Body() updateTeamDto: UpdateTeamDto,
    ) {
        await this.usersService.hasPermissionsSystemOrTeam(
            user,
            id,
            [TeamPermissions.SPECIAL],
            [Permissions.CAN_CREATE_TEAMS],
        );

        return await this.teamsService.update(user, id, updateTeamDto);
    }

    //по ид команды найти всех юзеров
    @Get(':id/users')
    @ApiOperation({summary: 'Получение участников коллектива по id коллектива'})
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Идентификатор коллектива',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешно',
        type: UserFunction,
    })
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    teamsAndUsers(@Param('id') id: number, @Query() uFDto: UserFunctionDto) {
        return this.teamsService.teamWithUsers(id, uFDto);
    }

    //по ид команды и id юзера найти есть ли юзер в вкомманде
    @Get(':id/users/:id_user')
    @ApiOperation({summary: 'Получение участника коллектива по id коллектива и id участника'})
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешно',
        type: UserFunction,
    })
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    teamsAndUser(@Param('id') id: number, @Param('id_user') idUser: number) {
        return this.teamsService.teamWithUser(id, idUser);
    }

    @Get(':id')
    @ApiOperation({summary: 'Получение коллектива по id'})
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Идентификатор коллектива',
    })
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно', type: Team})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    findOne(@Param('id') id: number) {
        return this.teamsService.findOne(id);
    }

    @Get(':id/functions')
    @ApiOperation({summary: 'Получение списка должностей в коллективе'})
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Идентификатор коллектива',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешно',
        type: Function,
    })
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    teamsFunctions(@Param('id') id: number) {
        return this.teamsService.teamsFunctions(id);
    }

    @Post()
    // определяет авторизован ли пользователь и какие у него разрешения
    @UseGuards(LocalAuthGuard, PermissionsGuard)
    @SetMetadata('permissions', [Permissions.CAN_CREATE_TEAMS])
    @ApiOperation({
        summary: 'Создать новый коллектив (ответственный по направлению)',
    })
    @ApiBody({
        description: 'название коллектива, ФИО руководителя, описание проекта',
        required: true,
    })
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно'})
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request, какие то данные неверно введены',
    })
    @UseInterceptors(FilesInterceptor('files'))
    async createTeam(
        @UserDecorator() user: User,
        @Body() createTeamDto: CreateTeamDto,
    ) {
        return await this.teamsService.createTeam(user, createTeamDto);
    }

    // ------------------------------------------------------------------------------------------------------
    // team photos
    @Post(':id/photo')
    @UseGuards(LocalAuthGuard) // определяет авторизован ли пользователь
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({summary: 'Загрузить фото в коллектив'})
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Идентификатор коллектива',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешно',
        type: Function,
    })
    async addTeamPhotos(
        @UserDecorator() user: User,
        @Req() request: Request,
        @Param('id') id: number,
        @UploadedFile(new FileImageValidationPipe()) file: Express.Multer.File,
    ) {
        const hasPermissions = await this.usersService.hasPermissionsSystemOrTeam(
            user,
            id,
            [TeamPermissions.SPECIAL],
            [Permissions.CAN_CREATE_TEAMS],
        );

        if (hasPermissions) {
            const startPathUrl = `${request.protocol}://${request.get('host')}`;

            const path = await this.uploadsService.uploadImage(
                startPathUrl,
                file.buffer,
            );
            return this.teamsService.addTeamPhotos(id, path);
        } else
            throw new ForbiddenException(
                'Вы имеете недостаточно прав в коллективе, обратитесь к руководителю',
            );
    }

    @Delete('photos/:id_photo')
    @UseGuards(LocalAuthGuard)
    @ApiOperation({summary: 'Загрузить фото в коллектив'})
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Идентификатор коллектива',
    })
    async deleteTeamPhotos(
        @UserDecorator() user: User,
        @Param('id_photo') id_photo: number,
    ) {
        const photo = await this.teamsService.getTeamPhoto(id_photo);
        // console.log(photo, id_photo,photo.team.id)

        await this.usersService.hasPermissionsSystemOrTeam(
            user,
            photo.team.id,
            [TeamPermissions.SPECIAL],
            [Permissions.CAN_CREATE_TEAMS],
        );

        return await this.teamsService.deleteTeamPhotos(id_photo);
    }

    // team photos
    // ------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------------
    // team avs
    @Post(':id/image')
    @UseGuards(LocalAuthGuard, PermissionsGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({summary: 'Загрузить изображение коллектива'})
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Идентификатор коллектива',
    })
    async addTeamAvs(
        @UserDecorator() user: User,
        @Req() request: Request,
        @Param('id') id: number,
        @UploadedFile(new FileImageValidationPipe()) file: Express.Multer.File,
    ) {
        const hasPermissions = await this.usersService.hasPermissionsSystemOrTeam(
            user,
            id,
            [TeamPermissions.SPECIAL],
            [Permissions.CAN_CREATE_TEAMS],
        );

        if (hasPermissions) {
            const startPathUrl = `${request.protocol}://${request.get('host')}`;

            const path = await this.uploadsService.uploadImage(
                startPathUrl,
                file.buffer,
            );
            return this.teamsService.addTeamAvs(id, path);
        } else
            throw new ForbiddenException(
                'Вы имеете недостаточно прав в коллективе, обратитесь к руководителю',
            );
    }

    @Delete(':id/image')
    @UseGuards(LocalAuthGuard)
    @ApiOperation({summary: 'Загрузить фото в коллектив'})
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Идентификатор коллектива',
    })
    async deleteTeamAvs(
        @UserDecorator() user: User,
        @Param('id') id: number,
        @Query() params: { path: string },
    ) {
        const hasPermissions = await this.usersService.hasPermissionsSystemOrTeam(
            user,
            id,
            [TeamPermissions.SPECIAL],
            [Permissions.CAN_CREATE_TEAMS],
        );

        if (hasPermissions) {
            return await this.teamsService.deleteTeamAvs(id, params.path);
        } else
            throw new ForbiddenException(
                'Вы имеете недостаточно прав в коллективе, обратитесь к руководителю',
            );
    }

    // team avs
    // ------------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------
    // requisition ------------------------------------------------------------------
    @Get('/:team_id/requisition')
    @ApiOperation({
        summary: 'Получить список заявок в коллектив по ид колектива',
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Идентификатор коллектива',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешно',
        type: Requisitions,
    })
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    async userRequisitionByTeam(
        @Param('team_id') team_id: number,
        @Query() reqDto: RequisitionDto,
    ): Promise<Requisitions[]> {
        return await this.teamsService.findAllRequisitions(team_id, reqDto);
    }

    @Get('requisition/:id')
    @ApiOperation({summary: 'Получить список заявок в коллектив по ид заявки'})
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Идентификатор запроса',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешно',
        type: Requisitions,
    })
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    async userRequisition(@Param('id') id: number): Promise<Requisitions> {
        return await this.teamsService.findRequisition(id);
    }

    @Delete('requisition/:id')
    @ApiOperation({summary: 'Удалить заявку в коллектив по ид заявки'})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    async deleteRequisition(@Param('id') id: number) {
        return await this.teamsService.deleteRequisition(id);
    }

    @Put('requisition/:id')
    @UseGuards(LocalAuthGuard, PermissionsGuard)
    @SetMetadata('permissions', [Permissions.CAN_EDIT_STATUS_REQUISITIONS])
    @ApiOperation({summary: 'обновить заявку в коллектив'})
    @ApiParam({name: 'id', required: true, description: 'Идентификатор'})
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешно',
        type: Function,
    })
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    async updateRequisition(
        @UserDecorator() user: User,
        @Param('id') req_id: number,
        @Body() updateRequisitionDto: RequisitionDto,
    ) {
        const requisition = await this.teamsService.findRequisition(req_id);
        const editStatusReq = await this.usersService.checkPermissions(user, [Permissions.CAN_EDIT_STATUS_REQUISITIONS_ALL], false)
        const isLeader = await this.usersService.hasPermissionsInTeam(
            user.userId,
            requisition.team.id,
            [TeamPermissions.SPECIAL],
        );

        if (!editStatusReq && !isLeader) {
            throw new BadRequestException("У вас нет разрешений")
        }

        return await this.teamsService.updateRequisition(
            req_id,
            updateRequisitionDto,
        );

    }

    @Get('requisitions/user/:userId')
    @ApiOperation({summary: 'Получить все заявки пользователя по его ID'})
    @ApiParam({
        name: 'userId',
        required: true,
        description: 'Идентификатор пользователя',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешно',
    })
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    async getRequisitionsByUserId(
        @Param('userId') userId: number,
    ): Promise<Requisitions[]> {
        return await this.teamsService.findAllRequisitionsByUserId(userId);
    }

    @Post('requisitions')
    @UseGuards(LocalAuthGuard)
    @ApiOperation({summary: 'Создание заяки на вступление в коллектив'})
    @ApiBody({
        type: CreateRequisitionDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Заявка успешно создана',
        type: Requisitions,
    })
    async createRequisition(
        @UserDecorator() user: User,
        @Body() dto: CreateRequisitionDto,
    ): Promise<Requisitions> {
        user = await this.usersService.findById(user.userId);
        return await this.teamsService.createRequisitionOrUpdate(dto, user);
    }

    // requisition --------------------------------------------------------------------

    // assign team roles --------------------------------------------------------------------
    @Post('user-functions/new-participant')
    @UseGuards(LocalAuthGuard, PermissionsGuard)
    @ApiOperation({summary: 'создать нового участника коллектива'})
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешно',
        type: UserFunction,
    })
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    async assignRole(
        @UserDecorator() user: User,
        @Body() userFDto: UserFunctionDto,
    ) {

        const editStatusReq = await this.usersService.checkPermissions(user, [Permissions.CAN_EDIT_STATUS_REQUISITIONS_ALL], false)
        const isLeader = await this.usersService.hasPermissionsInTeam(
            user.userId,
            userFDto.team,
            [TeamPermissions.SPECIAL],
            false,
        );

        if (!editStatusReq && !isLeader) {
            throw new BadRequestException("У вас нет разрешений")
        }

        const directionTeamLeaderDto = new AssignDirectionTeamLeaderDto();

        directionTeamLeaderDto.teamId = userFDto.team;
        directionTeamLeaderDto.userIds = [userFDto.user];
        directionTeamLeaderDto.roleName = TeamRoles.Member;

        // назначить нового пользвоателя
        // await this.teamsService.assignTeamRole(user, directionTeamLeaderDto);

        return await this.teamsService.assignTeamRole(user, directionTeamLeaderDto);
    }

    @Post('assign-direction-leader')
    @UseGuards(LocalAuthGuard, PermissionsGuard)
    @SetMetadata('permissions', [Permissions.CAN_EDIT_STATUS_REQUISITIONS])
    assignDirectionLeader(
        @UserDecorator() user: User,
        @Body() directionTeamLeaderDto: AssignDirectionTeamLeaderDto,
    ) {
        return this.teamsService.assignTeamRole(user, directionTeamLeaderDto);
    }
}
