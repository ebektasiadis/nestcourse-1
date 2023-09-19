import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Module({
  providers: [ReportsService, ReportsService],
})
export class ReportsModule {}
