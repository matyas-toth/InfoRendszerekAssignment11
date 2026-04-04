export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponseDTO {
    accessToken: string;
    user: UserDTO;
}

export interface UserDTO {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}
