import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

const AUTH_API = 'https://training-homework.calllab.net';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private readonly USER_AUTH_KEY = 'user-auth';
  constructor(private client: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.client.post(
      AUTH_API + '/v1/login',
      { username: username, password: password },
      httpOptions
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.USER_AUTH_KEY);
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    return sessionStorage.getItem(this.USER_AUTH_KEY) !== null;
  }
}
