export interface LocationDTO {
    id: number;
    institutionName: string;
    address: string;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface DonorDTO {
    id: number;
    name: string;
    gender: string;
    nationality: string;
    birthPlace: string;
    birthDate: Date;
    address: string;
    tajNumber: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface DonationDTO {
    id?: number;
    donationDate: Date;
    eligible: boolean;
    ineligibilityReason?: string;
    doctorName: string;
    directed: boolean;
    patientName?: string;
    patientTajNumber?: string;
    location: LocationDTO;
    donor: DonorDTO;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface DonationCreateDTO {
    locationId: number;
    donorId: number;
    donationDate: Date;
    eligible: boolean;
    ineligibilityReason?: string;
    doctorName: string;
    directed: boolean;
    patientName?: string;
    patientTajNumber?: string;
}

export interface DonationFilterDTO {
    locationId?: number;
    donorId?: number;
    startDate?: Date;
    endDate?: Date;
}
