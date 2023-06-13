import { Column, Entity, ManyToOne } from 'typeorm';

import { DefaultEntity } from './default.entity';
import { JobOpening } from './job-opening.entity';
import { User } from './user.entity';

@Entity('interview_history')
export class InterviewHistory extends DefaultEntity {
  @ManyToOne(() => User, (user) => user.interviewHistories, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: 'jsonb' })
  chatHistory: Record<string, unknown>;

  @ManyToOne(() => JobOpening, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  jobOpening: JobOpening;

  @Column()
  chatDate: Date;
}
