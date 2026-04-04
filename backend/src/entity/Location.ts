import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import { Donation } from "./Donation";

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    institutionName: string;

    @Column()
    address: string;

    @Column({ default: true })
    active: boolean;

    @OneToMany(() => Donation, donation => donation.location)
    donations: Donation[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
