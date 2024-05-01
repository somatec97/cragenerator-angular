import { Component } from '@angular/core';
import { CrageneratorService } from './cragenerator.service';
import { OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { ApiJFService } from './api-jf.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CrageneratorService, ApiJFService]
})
export class AppComponent  implements OnInit {
  title = 'cragenerator';
  pdf = Object
  craForm !: FormGroup;
  joursFeries: any[] = [];

  constructor(private crageneratorService: CrageneratorService, private formBuilder: FormBuilder,private apiJFService: ApiJFService){
    this.joursFeries = [];
    const moisEnCours = new Date().getMonth()+1;
    this.lesJoursFeries(moisEnCours);
  }
  lesJoursFeries(mois: number){
    this.apiJFService.lesJoursFeries(mois).subscribe((data: 
      {[key: string]: string }) => {
      this.joursFeries = Object.keys(data).map(date => ({date, name: data[date]}));
      console.log(this.joursFeries);
    })
  }
    ngOnInit(){
      this.craForm = this.formBuilder.group({
        description:"",
        client:"",
        projet:"",
        tjm:0.00,
        mois: [new Date().getMonth()+1, Validators.required],
        lignes: this.formBuilder.array([
          this.creerLigne()
        ])
      });
      this.craForm.get('mois')?.valueChanges.subscribe(mois => {
        this.lesJoursFeries(mois);
      });
    }   
  
    creerLigne(): FormGroup{
      return this.formBuilder.group({
        dateDebut: null,
        dateFin: null,
        heuresTravail:0,
      });
    }
    ajoutLigne(): void{
      this.lignes.push(this.creerLigne());
    }
    get lignes(): FormArray{
      return this.craForm.get('lignes') as FormArray;
    }
    getISOString(date: Date): string {
      let d = date,
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = ''+ d.getFullYear(),
      hours = ''+d.getHours(),
      minutes = ''+d.getMinutes(),
      seconds = ''+d.getSeconds();
      month = month.length < 2? '0' + month : month;
      day   = day.length < 2? '0' + day : day;
      hours = hours.length < 2?'0'+hours:hours;
      minutes = minutes.length< 2? '0'+minutes:minutes;
      seconds = seconds.length< 2? '0'+seconds:seconds;
      return ( [year, month, day].join('-')+'T'+[hours,minutes,seconds].join(':')+'.000');
    }
  
  genererCraPdf(craForm: any){
    this.craForm.value.lignes.forEach((ligne: any) => {
      ligne.dateDebut = this.getISOString(new Date(ligne.dateDebut));
      ligne.dateFin = this.getISOString(new Date(ligne.dateFin));
    });
    console.log(this.craForm.value);
    this.crageneratorService.genererCraPdf(this.craForm.value).subscribe(x => {
      const blob = new Blob([x], {type: 'app/pdf'});
      const data = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = data;
      link.download = 'cragenerator.pdf';
      link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

      setTimeout(function(){
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);

    });
  }
}

