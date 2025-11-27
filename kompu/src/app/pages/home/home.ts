import { Component } from '@angular/core';
import { Menu } from "../../components/menu/menu";
import { PiePagina } from "../../components/pie-pagina/pie-pagina";
import { ScrollToTop } from "../../components/scroll-to-top/scroll-to-top";

@Component({
  selector: 'app-home',
  imports: [Menu, PiePagina, ScrollToTop],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
