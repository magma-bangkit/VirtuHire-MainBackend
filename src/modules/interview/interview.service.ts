import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from 'langchain/prompts';
import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import { err, ok } from 'neverthrow';
import { Repository } from 'typeorm';

import { PromptMessageTemplates } from '@/common/constants/prompt-message-template.constant';
import { ServiceException } from '@/common/exceptions/service.exception';
import { ChatUtils } from '@/common/helpers/chat.utils';
import { InterviewHistory } from '@/entities/interview-history.entity';

import { JobOpeningService } from '../job-opening/job-opening.service';
import { OpenAIService } from '../openai/openai.service';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(InterviewHistory)
    private readonly interviewRepo: Repository<InterviewHistory>,
    private readonly jobOpeningService: JobOpeningService,
    private readonly openAiService: OpenAIService,
  ) {}

  private readonly paginationConfig: PaginateConfig<InterviewHistory> = {
    sortableColumns: ['id', 'createdAt', 'updatedAt'],
    nullSort: 'last',
    defaultLimit: 15,
    defaultSortBy: [['updatedAt', 'ASC']],
  };

  public async getInterviewHistories(userId: string, query: PaginateQuery) {
    const queryBuilder = this.interviewRepo
      .createQueryBuilder('interview')
      .where('interview.userId = :userId', {
        userId,
      });

    return paginate(query, queryBuilder, this.paginationConfig);
  }

  public async getInterviewHistoryById(id: string) {
    const interview = await this.interviewRepo.findOne({
      where: { id },
    });

    if (!interview) {
      return err(new ServiceException('INTERVIEW_NOT_FOUND'));
    }

    return ok(interview);
  }

  public async startInterview(id: string, userId: string) {
    const job = await this.jobOpeningService.getJobOpeningById(id);

    if (job.isErr()) {
      return err(new ServiceException('JOB_OPENING_NOT_FOUND'));
    }

    const initialInterviewTemplate = ChatPromptTemplate.fromPromptMessages([
      HumanMessagePromptTemplate.fromTemplate(
        PromptMessageTemplates.SYSTEM_RULES,
      ),
      HumanMessagePromptTemplate.fromTemplate(
        PromptMessageTemplates.JOB_DESCRIPTION,
      ),
      HumanMessagePromptTemplate.fromTemplate(
        PromptMessageTemplates.HUMAN_INTRODUCTION,
      ),
    ]);

    return this.openAiService.startChatFromTemplate(
      initialInterviewTemplate,
      {
        company: 'PT Reka Multi Aptika',
        companyLocation: 'Jakarta Pusat',
        title: 'Backend Developer',
        responsibilities:
          'Have a minimum 2 years of experience, Knowledge in HTML, CSS, JavaScript, jQuery, Bootstrap is plus, Understanding of object-oriented PHP programming, Proficiency in PHP and Laravel framework, Proficiency in REST API, Proficiency in code version tools, such as Git, Strong attention to detail, analytical and problem-solving skill, Experienced working in teams, Can join ASAP',
        qualifications:
          'Build scalable and robust web application, Build reusable code and libraries for future use, Optimize code and application for maximum speed and scalability, Troubleshooting application and code issues, Implement security and data protection, Integration of data storage solutions, Performance tuning, improvement, balancing, usability, automation, Work collaboratively with design team to understand end user requirements to provide technical solutions and for the implementation of new software features, Continuously discover, evaluate, and implement new technologies to maximize development efficiency',
        skills:
          'JavaScript, jQuery, HTML, Bootstrap, CSS, Rest API, PHP Laravel Framework, Git',
        city: 'Jakarta Pusat',
        type: 'Full Time',
      },
      ChatUtils.generateChatSessionId(userId),
    );
  }
}
