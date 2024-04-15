import { Component } from '@angular/core';
import { CrageneratorService } from './cragenerator.service';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CrageneratorService]
})
export class AppComponent  {
  title = 'cragenerator';
  pdf = Object

  constructor(private crageneratorService: CrageneratorService){

  }
 
  genererCraPdf(){
    this.crageneratorService.genererCraPdf().subscribe(x => {
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
