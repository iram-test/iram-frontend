import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../models/user-entity';
import { AppSettings } from '../constants/AppSettings';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly authChangeSub = new Subject<boolean>();
  public authChanged = this.authChangeSub.asObservable();

  constructor(private readonly http: HttpClient) { }

  public registerUser = (route: string, user: User) => {
    return this.http.post(`${AppSettings.AUTH_ENDPOINT}${route}`, user);
  }

  public loginUser = (route: string, user: User) => {
    return this.http.post(`${AppSettings.AUTH_ENDPOINT}${route}`, user);
  }

  public logoutUser = () => {
    localStorage.removeItem("token");
    this.sendAuthStateChangeNotification(false);
  }

  public isUserAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token;
  }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    return this.authChangeSub.next(isAuthenticated);
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
