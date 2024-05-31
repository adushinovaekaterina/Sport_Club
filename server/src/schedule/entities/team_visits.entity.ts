import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TeamSchedule } from './schedule.entity';
import {Team} from "../../teams/entities/team.entity";
import {Semester} from "./semester.entity";

@Entity('team_visits')
export class TeamVisits {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  date_visit: Date;

  @ApiProperty()
  @Column({ nullable: true })
  status_visit: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn([{ name: 'id_user' }])
  user: User;

  @ManyToOne(() => Team, (team) => team.id)
  @JoinColumn([{ name: 'id_team' }])
  team: Team;

  @ManyToOne(() => Semester, (s) => s.id)
  @JoinColumn([{ name: 'id_semester' }])
  semester: Semester;


  @ManyToOne(() => TeamSchedule, (teamSchedule) => teamSchedule.id)
  @JoinColumn([{ name: 'id_team_schedule' }])
  team_schedule: TeamSchedule;
}
