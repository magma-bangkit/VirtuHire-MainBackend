import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InterviewHistory } from '@/entities/interview-history.entity';

import { ChatController } from './interview.controller';
import { InterviewService } from './interview.service';
import { JobOpeningModule } from '../job-opening/job-opening.module';
import { OpenAIModule } from '../openai/openai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InterviewHistory]),
    JobOpeningModule,
    OpenAIModule,
  ],
  controllers: [ChatController],
  providers: [InterviewService],
  exports: [InterviewService],
})
export class InterviewModule {}
