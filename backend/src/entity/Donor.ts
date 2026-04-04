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
export class Donor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    gender: string;

    @Column()
    nationality: string;

    @Column()
    birthPlace: string;

    @Column()
    birthDate: Date;

    @Column()
    address: string;

    @Column({ unique: true })
    tajNumber: string;

    @OneToMany(() => Donation, donation => donation.donor)
    donations: Donation[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
