import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate } from 'langchain/prompts';
import { err, ok } from 'neverthrow';

import { ConfigName } from '@/common/constants/config-name.constant';
import { ServiceException } from '@/common/exceptions/service.exception';
import { IOpenAIConfig } from '@/lib/config/configs/openai.config';

import { IORedisChatMessageHistory } from './ioredis-chat-history';

@Injectable()
export class OpenAIService {
  public chatModel: ChatOpenAI;
  private openAIEmbeddings: OpenAIEmbeddings;

  constructor(
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    const openAIConfig = this.configService.get<IOpenAIConfig>(
      ConfigName.OPENAI,
    );

    this.chatModel = new ChatOpenAI({
      openAIApiKey: openAIConfig?.openAIApiKey,
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
      topP: 0.5,
      frequencyPenalty: 0,
      presencePenalty: 0,
    });

    this.openAIEmbeddings = new OpenAIEmbeddings({
      openAIApiKey: openAIConfig?.openAIApiKey,
      modelName: 'text-embedding-ada-002',
    });
  }

  public async generateEmbeddings(input: string) {
    let embeddingResponse;
    try {
      embeddingResponse = await this.openAIEmbeddings.embedQuery(input);
    } catch (error) {
      return err(new ServiceException('OPENAI_ERROR', error));
    }

    return ok(embeddingResponse);
  }

  public async startChatFromTemplate(
    prompt: ChatPromptTemplate,
    input: Record<string, unknown>,
    sessionId: string,
  ) {
    const memory = new BufferMemory({
      chatHistory: new IORedisChatMessageHistory({
        sessionId: sessionId,
        sessionTTL: 300,
        client: this.redis,
      }),
    });

    prompt.inputVariables = Object.keys(input);
    prompt.formatPromptValue(input);

    const chain = new ConversationChain({
      llm: this.chatModel,
      memory,
      prompt,
    });

    return await chain.call(input);
  }
}
