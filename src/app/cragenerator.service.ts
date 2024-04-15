import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrageneratorService {
  readonly API_URL = "http://localhost:8080"
  readonly PDF = "/generer-pdf"

  constructor(private httpClient: HttpClient) {

   }
   genererCraPdf(): Observable<Blob>{
    return this.httpClient.get(`${this.API_URL+this.PDF}`, { responseType:`blob`});
   }
}
