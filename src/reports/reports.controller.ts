import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGaurd } from '../gaurds/auth.gaurd';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGaurd)
  createReport(@Body() body: CreateReportDto) {
    return this.reportsService.create(body);
  }
}
