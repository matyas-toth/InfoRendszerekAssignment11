import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from "typeorm";
import { Location } from "./Location";
import { Donor } from "./Donor";

@Entity()
export class Donation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    donationDate: Date;

    @Column()
    eligible: boolean;

    @Column({ nullable: true })
    ineligibilityReason: string;

    @Column()
    doctorName: string;

    @Column()
    directed: boolean;

    @Column({ nullable: true })
    patientName: string;

    @Column({ nullable: true })
    patientTajNumber: string;

    @ManyToOne(() => Location, location => location.donations)
    location: Location;

    @ManyToOne(() => Donor, donor => donor.donations)
    donor: Donor;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
