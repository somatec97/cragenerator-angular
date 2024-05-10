import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiJFService {
  private apiUrl = 'https://calendrier.api.gouv.fr/jours-feries/metropole/';
  

  constructor(private httpClient: HttpClient) { }
  //c'est commentaire!!!
  
 lesJoursFeries(mois: number, annee: number): Observable<any>{  
  const url = `${this.apiUrl}${annee}.json`;
  return this.httpClient.get<any>(url).pipe(
    map((joursFeries: {[key: string]: string}) => {
      const joursFeriesDuMois: { [key: string]: string } = {};
      for (const date in joursFeries) {
        const dateObj = new Date(date);
        if(dateObj.getMonth()+1 === mois){
          joursFeriesDuMois[date] = joursFeries[date];
        }
      }
      return joursFeriesDuMois;
    })
  );
}

}
