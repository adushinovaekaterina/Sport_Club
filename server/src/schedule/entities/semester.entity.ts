import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('semester')
export class Semester {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  value: number;

  @ApiProperty()
  @CreateDateColumn()
  date_start: Date;

  @ApiProperty()
  @UpdateDateColumn()
  date_end: Date;
}
