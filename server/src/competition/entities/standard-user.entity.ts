import {ApiProperty} from "@nestjs/swagger";
import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Dictionary} from "../../general/entities/dictionary.entity";
import {User} from "../../users/entities/user.entity";
@Entity('standard_user')
export class StandardUserEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    value: number;

    @ApiProperty()
    @CreateDateColumn()
    date_create: Date;

    @ManyToOne(() => Dictionary, (d) => d.id)
    @JoinColumn([{ name: 'standard_name_id' }])
    standard: Dictionary;

    @ManyToOne(() => User, (d) => d.id, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'user_id' }])
    user: User;
}
