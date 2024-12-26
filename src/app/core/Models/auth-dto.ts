export interface RegisterDTO {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

export interface LoginWithUsernameDTO {
    username: string;
    password: string;
}

export interface LoginWithEmailDTO {
    email: string;
    password: string;
}