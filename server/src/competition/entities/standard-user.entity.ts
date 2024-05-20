import {ApiProperty} from "@nestjs/swagger";
import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Dictionary} from "../../general/entities/dictionary.entity";
import {User} from "../../users/entities/user.entity";
import {Team} from "../../teams/entities/team.entity";
@Entity('standard_user')
export class StandardUserEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    value: number;

    @ApiProperty()
    @Column({default:1})
    semester: number;

    @ApiProperty()
    @CreateDateColumn()
    date_create: Date;

    @ApiProperty()
    @ManyToOne(() => Team, (team) => team.id,{ onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'team_id' }])
    team: Team;

    @ManyToOne(() => Dictionary, (d) => d.id)
    @JoinColumn([{ name: 'standard_name_id' }])
    standard: Dictionary;

    @ManyToOne(() => User, (d) => d.id, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'user_id' }])
    user: User;
}
