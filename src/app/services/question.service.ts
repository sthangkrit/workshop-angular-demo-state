import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

const AUTH_API = 'https://training-homework.calllab.net';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  getQuestionCategoryList(): Observable<any> {
    const url = AUTH_API + '/v1/questions/categories';
    console.log('Request URL:', url);
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('HTTP Error:', error);
        return throwError(error);
      })
    );
  }

  getQuestionCategoryById(id: string): Observable<any> {
    const url = AUTH_API + '/v1/questions/categories/' + id;
    console.log('Request URL:', url);
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('HTTP Error:', error);
        return throwError(error);
      })
    );
  }

  submitAssignment(request: any): Observable<any> {
    const url = `${AUTH_API}/v1/questions/submit-assignment`;
    console.log('Request URL:', url);
    return this.http
      .post(url, request, { headers: { 'Content-Type': 'application/json' } })
      .pipe(
        catchError((error) => {
          console.error('HTTP Error:', error);
          return throwError(error);
        })
      );
  }
}
