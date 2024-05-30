import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Semester} from "../../schedule/entities/semester.entity";
import {Team} from "./team.entity";

@Entity('team_semester_visits')
export class TeamSemesterVisits {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ default: 0 })
  max_visits: number;

  @ManyToOne(() => Team, (team) => team.id)
  @JoinColumn([{ name: 'id_team' }])
  team: Team;

  @ManyToOne(() => Semester, (s) => s.id)
  @JoinColumn([{ name: 'id_semester' }])
  semester: Semester;
}
