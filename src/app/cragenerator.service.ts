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
   genererCraPdf(craForm: any): Observable<Blob>{
    return this.httpClient.post(`${this.API_URL+this.PDF}`,craForm, { responseType:`blob`});
   }
}
