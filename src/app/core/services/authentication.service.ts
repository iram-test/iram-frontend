import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { AppSettings } from '../constants/AppSettings';
import {
  LoginWithEmailDTO,
  LoginWithUsernameDTO,
  RegisterDTO,
} from '../models/auth-dto';
import { AuthResult } from '../models/AuthResult';
import { User } from '../models/user-entity';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly authChangeSub = new Subject<boolean>();
  public authChanged = this.authChangeSub.asObservable();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      const user: User = JSON.parse(userString);
      this.currentUserSubject.next(user);
    }
  }

  public registerUser(registerDto: RegisterDTO): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${AppSettings.AUTH_ENDPOINT}register`, registerDto)
      .pipe(
        // Perform login after successful registration
        tap((res: AuthResult) => {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          this.sendAuthStateChangeNotification(true);

          const user = this.extractUserFromToken(res.accessToken);
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }),
        catchError(this.handleError)
      );
  }


  public loginUserWithUsername(
    loginDto: LoginWithUsernameDTO,
  ): Observable<AuthResult> {
    return this.login(loginDto, `${AppSettings.AUTH_ENDPOINT}login/username`);
  }

  public loginUserWithEmail(loginDto: LoginWithEmailDTO): Observable<AuthResult> {
    return this.login(loginDto, `${AppSettings.AUTH_ENDPOINT}login/email`);
  }

  private login(loginDto: any, url: string): Observable<AuthResult> {
    return this.http.post<AuthResult>(url, loginDto).pipe(
      tap((res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.sendAuthStateChangeNotification(true);
      }),
      map(res => {
        const user = this.extractUserFromToken(res.accessToken);
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return res;
      }),
      catchError(this.handleError),
    );
  }

  public logoutUser(): Observable<void> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      this.sendAuthStateChangeNotification(false);
      this.currentUserSubject.next(null);
      localStorage.removeItem('currentUser');
      return of(void 0);
    }

    const headers = new HttpHeaders({
      'x-refresh-token': refreshToken,
      'Content-Type': 'application/json'
    });

    return this.http.post<void>(`${AppSettings.AUTH_ENDPOINT}logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        this.sendAuthStateChangeNotification(false);
        this.currentUserSubject.next(null);
      }),
      catchError(this.handleError),
    );
  }

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  };

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  };

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  extractUserFromToken(token: string): User | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      const user: User = undefined;

      this.http.get<User>(`${environment.apiUrl}/users/${payload.userId}`)
        .subscribe(user => {
          user = user;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        });
        return user;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }


  public refreshToken(refreshToken: string): Observable<AuthResult> {
    const headers = new HttpHeaders({
      'x-refresh-token': refreshToken,
      'Content-Type': 'application/json'
    });

    return this.http.post<AuthResult>(`${AppSettings.AUTH_ENDPOINT}refresh`, {}, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`,
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.'),
    );
  }
}
