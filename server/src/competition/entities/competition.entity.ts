import {ApiProperty} from "@nestjs/swagger";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Dictionary} from "../../general/entities/dictionary.entity";
import {UserCompetition} from "./user-competition.entity";
@Entity('competition')
export class Competition {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    sport_type: string;

    @ApiProperty()
    @Column()
    city: string;

    @ApiProperty()
    @Column()
    date_start: Date;

    @ApiProperty()
    @Column()
    date_end: Date;

    @ManyToOne(() => Dictionary, (d) => d.id)
    @JoinColumn([{ name: 'level_id' }])
    level: Dictionary;

    @ApiProperty()
    @OneToMany(
        () => UserCompetition,
        (d) => d.competition,
        { cascade: true },
    )
    users: UserCompetition[];
}
