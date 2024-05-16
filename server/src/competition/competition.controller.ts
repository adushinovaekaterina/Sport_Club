import {Controller, Get, Query} from '@nestjs/common';
import { CompetitionService } from './competition.service';
import {SearchCompetitionDto} from "./dto/search-competition.dto";

@Controller('competition')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Get()
  async findAll(@Query() dto:SearchCompetitionDto) {
    return await this.competitionService.findAll(dto);
  }
}
