import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl =
    'https://my-dotnet-api.icysea-9e4aeb5a.polandcentral.azurecontainerapps.io/api/user';

  private userIdSubject = new BehaviorSubject<string | null>(null);
  public userId$ = this.userIdSubject.asObservable();

  private userNameSubject = new BehaviorSubject<string | null>(null);
  public userName$ = this.userNameSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {}

  registerUser(auth0Id: string, username: string): Observable<any> {
    const body = { auth0Id, username };
    return this.http.post<any>(`${this.apiUrl}/register`, body);
  }

  fetchUserId(): void {
    this.http
      .get<any>(`${this.apiUrl}/me`)
      .pipe(
        tap((response) => {
          // console.log('Fetched User Id from endpoint:', response);
          this.userIdSubject.next(response);
        }),
        catchError((error) => {
          console.error('Error fetching user ID:', error);
          return throwError(error);
        })
      )
      .subscribe();
  }

  fetchUserName(): void {
    this.http
      .get<any>(`${this.apiUrl}/name`)
      .pipe(
        tap((response) => {
          // console.log('Fetched User Name from endpoint:', response);
          this.userNameSubject.next(response.username);
        }),
        catchError((error) => {
          console.error('Error fetching user name:', error);
          return throwError(error);
        })
      )
      .subscribe();
  }

  getUserId(): string | null {
    return this.userIdSubject.getValue();
  }

  setUserId(userId: string): void {
    this.userIdSubject.next(userId);
  }
}
