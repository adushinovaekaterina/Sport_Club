import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";
import {ApiProperty} from "@nestjs/swagger";
import {Competition} from "./competition.entity";
@Entity('user_competition')
export class UserCompetition {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    result: string;

    @ApiProperty()
    @Column()
    result_type: string;

    @ManyToOne(() => User, (d) => d.id, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'user_id' }])
    user: User;

    @ManyToOne(() => Competition, (d) => d.id, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'competition_id' }])
    competition: Competition;
}
