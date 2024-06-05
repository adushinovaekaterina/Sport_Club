import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TeamFunction } from '../../users/entities/function.entity';
import { Journal } from '../../events/entities/journal.entity';
import { Form } from '../../forms/entities/form.entity';
import { Requisitions } from './requisition.entity';
import { TeamPhoto } from './team-photo.entity';
import {Semester} from "../../schedule/entities/semester.entity";
import {TeamSemesterVisits} from "./team-semester-visits.entity";

@Entity('teams')
export class Team {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({default:1})
  capacity: number;

  @ApiProperty()
  @CreateDateColumn({ default: () => 'now()' })
  creation_date: Date;

  @ApiProperty()
  @Column('simple-array')
  image: string[];

  @ApiProperty()
  @Column('simple-array')
  tags: string[];

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column({ nullable: true })
  short_description: string;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ['direction', 'university', 'teams'],
    default: 'teams',
  })
  type_team: string;

  @ApiProperty()
  @Column()
  shortname: string;

  @ApiProperty()
  @Column({ default: false })
  is_archive: boolean;

  //сборная
  @ApiProperty()
  @Column({ default: false })
  is_national: boolean;

  @ApiProperty()
  @Column('simple-array', { nullable: true })
  cabinets: number[];

  @ApiProperty()
  @Column('simple-array', { nullable: true })
  links: string[];

  @ApiProperty()
  @Column({ nullable: true })
  charter_team: string;


  @ApiProperty()
  @Column({ nullable: true })
  document: string;

  @ApiProperty()
  @Column({ default: true })
  set_open: boolean;

  @ManyToOne(() => Team, (team) => team.id)
  @JoinColumn([{ name: 'id_parent' }])
  id_parent: Team;

  @ManyToOne(() => Semester, (s) => s.id)
  @JoinColumn([{ name: 'id_semester' }])
  semester: Semester;

  @OneToMany(() => TeamFunction, (func) => func.team, { cascade: true })
  functions: TeamFunction[];

  @OneToMany(() => Journal, (journal) => journal.team, { cascade: true })
  journal: Journal[];

  @OneToMany(() => Form, (form) => form.team, { cascade: true })
  forms: Form[];

  @OneToMany(() => TeamPhoto, (teamPhoto) => teamPhoto.team, { cascade: true })
  team_photos: TeamPhoto[];

  @OneToMany(() => TeamSemesterVisits, (t) => t.team, {
    cascade: true,
  })
  team_semester_visits: TeamSemesterVisits[];

  @OneToMany(() => Requisitions, (requisition) => requisition.team)
  requisitions: Requisitions[];

  count_members:number
}
