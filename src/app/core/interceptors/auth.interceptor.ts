import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { AuthResult } from '../models/AuthResult'; // Make sure this path is correct
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private authService: AuthenticationService, private router: Router) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            request = this.addToken(request, accessToken);
        }

        return next.handle(request).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(request, next);
                } else {
                    return throwError(() => error);
                }
            })
        );
    }

    private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                return this.authService.refreshToken(refreshToken).pipe(
                    switchMap((authResult: AuthResult) => {
                        this.isRefreshing = false;
                        localStorage.setItem('accessToken', authResult.accessToken);
                        localStorage.setItem('refreshToken', authResult.refreshToken);
                        this.refreshTokenSubject.next(authResult.accessToken);
                        return next.handle(this.addToken(request, authResult.accessToken));
                    }),
                    catchError((err) => {
                        this.isRefreshing = false;
                        this.authService.logoutUser().subscribe();
                        this.router.navigate(['/login']);
                        return throwError(() => err);
                    })
                );
            } else {
                this.isRefreshing = false;
                this.authService.logoutUser().subscribe();
                this.router.navigate(['/login']);
                return throwError(() => new Error('No refresh token available.'));
            }
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    return next.handle(this.addToken(request, jwt));
                })
            );
        }
    }
}
