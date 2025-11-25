import { Component } from '@angular/core';

@Component({
  selector: 'app-pie-pagina',
  templateUrl: './pie-pagina.html',
  styleUrls: ['./pie-pagina.css'],
})
export class PiePagina {
  year: number = new Date().getFullYear();
}
