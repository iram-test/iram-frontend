import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppSettings } from '../constants/AppSettings';
import {
  LoginWithEmailDTO,
  LoginWithUsernameDTO,
  RegisterDTO,
} from '../models/auth-dto';
import { AuthResult } from '../models/AuthResult';
import { User } from '../models/user-entity'; // Імпортуємо User

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly authChangeSub = new Subject<boolean>();
  public authChanged = this.authChangeSub.asObservable();
  private currentUser: User | null = null; // Додаємо змінну для зберігання поточного користувача

  constructor(private readonly http: HttpClient) { }

  public registerUser(registerDto: RegisterDTO): Observable<AuthResult> {
    return this.http
      .post<AuthResult>(`${AppSettings.AUTH_ENDPOINT}register`, registerDto)
      .pipe(catchError(this.handleError));
  }

  public loginUserWithUsername(
    loginDto: LoginWithUsernameDTO,
  ): Observable<AuthResult> {
    return this.http
      .post<AuthResult>(`${AppSettings.AUTH_ENDPOINT}login/username`, loginDto)
      .pipe(
        tap((res) => {
          localStorage.setItem('accessToken', res.accessToken); // Зберігаємо accessToken
          localStorage.setItem('refreshToken', res.refreshToken); // Зберігаємо refreshToken
          this.sendAuthStateChangeNotification(true);
        }),
        catchError(this.handleError),
      );
  }

  public loginUserWithEmail(loginDto: LoginWithEmailDTO): Observable<AuthResult> {
    return this.http
      .post<AuthResult>(`${AppSettings.AUTH_ENDPOINT}login/email`, loginDto)
      .pipe(
        tap((res) => {
          localStorage.setItem('accessToken', res.accessToken); // Зберігаємо accessToken
          localStorage.setItem('refreshToken', res.refreshToken); // Зберігаємо refreshToken
          this.sendAuthStateChangeNotification(true);
        }),
        catchError(this.handleError),
      );
  }

  public logoutUser(): Observable<void> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      this.sendAuthStateChangeNotification(false);
      this.currentUser = null;
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
        this.sendAuthStateChangeNotification(false);
        this.currentUser = null;
      }),
      catchError(this.handleError),
    );
  }


  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem('accessToken'); // Перевіряємо accessToken
    return !!token; // Returns true if token exists
  };

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  };

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public refreshToken(refreshToken: string): Observable<AuthResult> {
    const headers = new HttpHeaders({
      'x-refresh-token': refreshToken,
      'Content-Type': 'application/json'
    });

    return this.http.post<AuthResult>(`${AppSettings.AUTH_ENDPOINT}refresh`, {}, { headers })
      .pipe(
        catchError(this.handleError) // Ensure error handling
      );
  }

  // Обробка помилок (можна винести в BaseService)
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
