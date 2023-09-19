import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { UsersController } from './users/users.controller';
import { ReportsController } from './reports/reports.controller';

@Module({
  imports: [UsersModule, ReportsModule],
  controllers: [AppController, UsersController, ReportsController],
  providers: [AppService],
})
export class AppModule {}
