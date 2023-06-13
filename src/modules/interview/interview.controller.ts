import { Body, Controller, Post } from '@nestjs/common';

import { InterviewService } from './interview.service';

@Controller({
  path: 'chat',
  version: '1',
})
export class ChatController {
  constructor(private readonly chatService: InterviewService) {}

  @Post()
  async chat() {
    return await this.chatService.startInterview(
      'huoxkWh2PPTZSOBINvH4o',
      'axkWh2PPTZSOBINvH4o',
    );
  }
}
