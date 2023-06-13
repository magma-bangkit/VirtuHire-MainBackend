import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobOpening } from '@/entities/job-opening.entity';

import { JobOpeningController } from './job-opening.controller';
import { JobOpeningService } from './job-opening.service';
import { OpenAIModule } from '../openai/openai.module';

@Module({
  imports: [TypeOrmModule.forFeature([JobOpening]), OpenAIModule],
  controllers: [JobOpeningController],
  providers: [JobOpeningService],
  exports: [JobOpeningService],
})
export class JobOpeningModule {}
