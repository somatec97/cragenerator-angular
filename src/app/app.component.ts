import { Component } from '@angular/core';
import { CrageneratorService } from './cragenerator.service';
import {MatToolbarModule} from '@angular/material/toolbar';
import { OnInit } from '@angular/core';

import { FormArray, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CrageneratorService]
})
export class AppComponent  implements OnInit {
  title = 'cragenerator';
  pdf = Object
  craForm !: FormGroup;

  constructor(private crageneratorService: CrageneratorService, private formBuilder: FormBuilder){}
    ngOnInit(){
      this.craForm = this.formBuilder.group({
        description:"",
        tjm:0.0,
        lignes: this.formBuilder.array([
          this.creerLigne()
        ])
      });
    }
    
    creerLigne(): FormGroup{
      return this.formBuilder.group({
        dateDebut:null,
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
    
  genererCraPdf(craForm: any){
    
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
