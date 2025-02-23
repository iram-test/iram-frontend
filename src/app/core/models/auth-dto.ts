export interface RegisterDTO {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: "User" | "Manager";
}

export interface LoginWithUsernameDTO {
  username: string;
  password: string;
}

export interface LoginWithEmailDTO {
  email: string;
  password: string;
}
