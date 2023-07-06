import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class RestService {



  constructor(private http: HttpClient) { }

  pay(token: any): Observable<any> {
    return this.http.post<any>('http://localhost:8192/wallet/test/stripe', token)
      .pipe(
        map(res => res));
  }

  save(token: any): Observable<any> {
    return this.http.post<any>('http://localhost:8192/wallet/test/stripe1', token)
      .pipe(
        map(res => res));
  }

  payAfter(customerId: any, amount: any): Observable<any> {
    return this.http.post<any>('http://localhost:8192/wallet/test/stripe2', {customerId, amount})
      .pipe(
        map(res => res));
  }


}
