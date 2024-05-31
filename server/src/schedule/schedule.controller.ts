import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query, SetMetadata, UseGuards,
} from '@nestjs/common';
import {ScheduleService} from './schedule.service';
import {
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {SearchVisitsDto} from './dto/search-visits.dto';
import {UpdateVisitsDto} from './dto/update-visits.dto';
import {GetAllCabinetsResponse} from './dto/get-all-cabinets.response';
import {CreateCabinetDto} from './dto/create-cabinet.dto';
import {CreateCabinetResponse} from './dto/create-cabinet.response';
import {DeleteCabinetResponse} from './dto/delete-cabinet.response';
import {SearchCabinetsDto} from './dto/search-cabinets.dto';
import {SearchScheduleDto} from './dto/search-schedule.dto';
import {CreateCabinetTimeDto} from './dto/create-cabinet-time.dto';
import {UpdateCabinetTimeDto} from './dto/update-cabinet-time.dto';
import {UserDecorator} from "../shared/user.decorator";
import {LocalAuthGuard} from "../users/guard/local-auth.guard";
import {PermissionsGuard} from "../users/guard/check-permissions.guard";
import {User} from "../users/entities/user.entity";
import {CreatSemesterDto} from "./dto/create-semester.dto";
import {Permissions} from "../shared/permissions";
import {SearchSemesterDto} from "./dto/search-semester.dto";
import {CreateScheduleDto} from "./dto/create-schedule.dto";

@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {
    }

    @Get('')
    @ApiOperation({summary: 'Получение расписания по id коллектива'})
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно'})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    findSchedule(@Query() searchScheduleDto: SearchScheduleDto) {
        return this.scheduleService.findSchedule(searchScheduleDto);
    }

    @Get('visits')
    @ApiOperation({summary: 'Получение посещаемости по id коллектива'})
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно'})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    findVisitsTeam(@Query() searchVisitsDto: SearchVisitsDto) {
        return this.scheduleService.findTeamVisits(searchVisitsDto);
    }


    @Post('visits')
    @ApiOperation({summary: 'Обновление посещаемости по id коллектива и юзера'})
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно'})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    updateOneVisit(@Body() updateVisitsDto: UpdateVisitsDto) {
        return this.scheduleService.updateTeamVisit(updateVisitsDto);
    }

    @Get('cabinets')
    @ApiOperation({summary: 'Получение всех аудиторий'})
    @ApiOkResponse({
        type: GetAllCabinetsResponse,
        status: HttpStatus.OK,
        description: 'Успешно',
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
    })
    getAllCabinets(@Query() searchCabinetsDto: SearchCabinetsDto) {
        return this.scheduleService.getAllCabinets(searchCabinetsDto);
    }

    @Post('cabinets')
    @ApiOperation({summary: 'Создание новой аудитории'})
    @ApiOkResponse({
        type: CreateCabinetResponse,
        status: HttpStatus.OK,
        description: 'Успешно',
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
    })
    createCabinet(@Body() dto: CreateCabinetDto) {
        return this.scheduleService.createCabinet(dto);
    }

    @Delete('cabinets/:id')
    @ApiOperation({summary: 'Удаление аудитории'})
    @ApiOkResponse({
        type: DeleteCabinetResponse,
        status: HttpStatus.OK,
        description: 'Успешно',
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
    })
    @ApiQuery({name: 'id', required: true, type: Number})
    deleteCabinet(@Param('id') id: number) {
        return this.scheduleService.deleteCabinet(id);
    }



    @Post('cabinets-time')
    @ApiOperation({summary: 'Резервирование аудитории'})
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Успешно',
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
    })
    createCabinetTime(@UserDecorator() user: User, @Body() dto: CreateCabinetTimeDto) {
        return this.scheduleService.createCabinetTime(user, dto);
    }

    @Delete('cabinets-time/:id')
    @ApiOperation({summary: 'Удаление зарезирвированной аудитории'})
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Успешно',
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
    })
    @ApiQuery({name: 'id', required: true, type: Number})
    deleteCabinetTime(@Param('id') id: number) {
        return this.scheduleService.deleteCabinetTime(id);
    }

    @Put('cabinets-time/:id')
    @ApiOperation({summary: 'Обновление зарезирвированной аудитории'})
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Успешно',
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Request',
    })
    @ApiQuery({name: 'id', required: true, type: Number})
    updateCabinetTime(
        @Param('id') id: number,
        @Body() updateCabinetTimeDto: UpdateCabinetTimeDto,
    ) {
        return this.scheduleService.updateCabinetTime(id, updateCabinetTimeDto);
    }

// --------------------------------------------------------------------------------------------------------------
// semester
// --------------------------------------------------------------------------------------------------------------

    @Get("semester")
    @ApiOperation({
        summary: 'Получение семестров',
    })
    async getSemesters(
        @Query() searchSemesterDto: SearchSemesterDto,
    ) {
        return this.scheduleService.findSemesters(searchSemesterDto)
    }

    @Post("semester")
    @UseGuards(LocalAuthGuard, PermissionsGuard)
    @SetMetadata('permissions', [Permissions.CAN_CHANGE_SEMESTER])
    @ApiOperation({
        summary: 'Обновление семестра',
    })
    async updateSemester(
        @UserDecorator() user: User,
        @Body() creatSemesterDto: CreatSemesterDto,
    ) {
        return this.scheduleService.createOrUpdateSemester(creatSemesterDto)
    }
}
