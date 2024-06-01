import {
    Controller,
    Get,
    Post,
    UploadedFile,
    UseInterceptors,
    HttpStatus,
    Query,
    Header,
    Res,
    Req,
    Delete,
    Body,
} from '@nestjs/common';
import {UploadsService} from './uploads.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiOperation, ApiParam, ApiResponse} from '@nestjs/swagger';
import {EventsService} from '../events/events.service';
import {Request, Response} from 'express';
import {FileSizeValidationPipe} from './validation/file.validation.pipe';
import {SearchEventDto} from 'src/events/dto/search-event.dto';
import {FileImageValidationPipe} from './validation/image_file.validation.pipe';
import {extname} from 'path';
import {SearchVisitsDto} from "../schedule/dto/search-visits.dto";
import {ScheduleService} from "../schedule/schedule.service";
import {UserFunctionDto} from "../users/dto/user-functions.dto";
import {TeamsService} from "../teams/teams.service";

@Controller('uploads')
export class UploadsController {
    constructor(
        private readonly uploadsService: UploadsService,
        private readonly eventsService: EventsService,

    ) {
    }

    @Post()
    @ApiOperation({summary: 'Сохранение файла на сервере (любой формат)'})
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно'})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Req() request: Request,
        @UploadedFile(new FileSizeValidationPipe()) file: Express.Multer.File,
    ) {
        const startPathUrl = `${request.protocol}://${request.get('host')}`;

        const path = await this.uploadsService.uploadFile(
            startPathUrl,
            file.buffer,
            extname(file.originalname),
        );

        return path;
    }

    @Post('image')
    @ApiOperation({summary: 'Сохранение изображения на сервер'})
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно'})
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'файл должен весить < 20 мб',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неподдерживаемый тип файла',
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(
        @Req() request: Request,
        @UploadedFile(new FileImageValidationPipe())
            file: Express.Multer.File,
    ) {
        const startPathUrl = `${request.protocol}://${request.get('host')}`;

        // convert to webp format
        const webPImageBuffer = await this.uploadsService.convertImgToWebp(
            file.buffer,
            800,
            300,
        );
        return await this.uploadsService.uploadFile(
            startPathUrl,
            webPImageBuffer,
            extname(file.originalname),
        );
    }

    @Delete()
    @ApiOperation({summary: 'Удаление файла с сервера'})
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно'})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    async deleteFileByUrl(@Body() params: { pathUrl: string }) {
        const res = await this.uploadsService.deleteFileByUrl(params.pathUrl);

        return res;
    }

    @Get('file_buffer')
    @ApiOperation({summary: 'Получение файла с сервера в виде буфера'})
    @ApiParam({name: 'path', description: 'путь к файлу для сохранения'})
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно'})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    async getFileBuffer(@Query() params) {
        const file = await this.uploadsService.getFileBuffer(params.path);

        return file;
    }
    // --------------------------------------------------------------------------------------------------------------
    // teams
    // --------------------------------------------------------------------------------------------------------------

    @Get('excel/team-visits')
    @Header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    @Header('Content-Disposition', 'attachment; filename=report_file.xlsx')
    @ApiOperation({
        summary: 'Получение файла excel по посещениям коллектива ',
    })
    @ApiResponse({status: HttpStatus.OK, description: 'Успешно'})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    async getReportTeamVisits(
        @Res() res: Response,
        @Query() dto: SearchVisitsDto,
    ) {
        await this.uploadsService.getReportTeamVisits(res, dto);
    }
}
