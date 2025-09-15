import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('outbox')
export class OutboxEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  aggregateId!: string;

  @Column()
  eventType!: string;

  @Column('jsonb')
  payload: any;

  @CreateDateColumn()
  occurredAt!: Date;

  @Column({ default: false })
  processed!: boolean;
}
