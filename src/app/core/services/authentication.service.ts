import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AppSettings } from '../constants/AppSettings';
import { RegisterDTO } from '../models/auth-dto'; // Import RegisterDTO
import { LoginWithUsernameDTO, LoginWithEmailDTO } from '../models/auth-dto'; // Import Login DTOs
import { AuthResult } from '../models/AuthResult';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly authChangeSub = new Subject<boolean>();
  public authChanged = this.authChangeSub.asObservable();

  constructor(private readonly http: HttpClient) { }

  public registerUser(registerDto: RegisterDTO): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${AppSettings.AUTH_ENDPOINT}register`, registerDto);
  }

  public loginUserWithUsername(loginDto: LoginWithUsernameDTO): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${AppSettings.AUTH_ENDPOINT}login/username`, loginDto);
  }

  public loginUserWithEmail(loginDto: LoginWithEmailDTO): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${AppSettings.AUTH_ENDPOINT}login/email`, loginDto);
  }

  public logoutUser(): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${AppSettings.AUTH_ENDPOINT}logout`, {});
  }

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    return !!token; // Returns true if token exists
  }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  }

  // public isUserAdmin = (): boolean => {
  //   const token = localStorage.getItem("token");
  //   const decodedToken = this.jwtHelper.decodeToken(token);
  //   const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  //   return role === "Administrator";
  // }

  // public forgorPassword = (route: string, body: ForgotPasswordDto) => {
  //   return this.http.post(`${AppSettings.API_ENDPOINT}${route}`, body);
  // }

  // public resetPassword = (route: string, body: ResetPasswordDto) => {
  //   return this.http.post(`${AppSettings.API_ENDPOINT}${route}`, body);
  // }

  // public confirmEmail = (route: string, token: string, email: string) => {
  //   let params = new HttpParams({ encoder: new CustomEncoder() });
  //   params = params.append('token', token);
  //   params = params.append('email', email);

  //   return this.http.get(`${AppSettings.API_ENDPOINT}${route}`, { params: params });
  // }

  // public twoStepLogin = (route: string, body: TwoFactorDto) => {
  //   return this.http.post<AuthResponseDto>(`${AppSettings.API_ENDPOINT}${route}`, body);
  // }
}
