import { Component } from '@angular/core';
import { Menu } from "../../components/menu/menu";
import { PiePagina } from "../../components/pie-pagina/pie-pagina";
import { ScrollToTop } from "../../components/scroll-to-top/scroll-to-top";
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  imports: [Menu, PiePagina, ScrollToTop],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  carro: Carrito[] = [];
  usuarioLogueado: boolean = false;

  constructor(private router: Router) { }
   
   ngOnInit(): void {
    this.cargarCarrito();
   }

   cargarCarrito(): void {
    try {
      // 1. Verificar si hay token (usuario logueado)
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No hay usuario logueado');
        this.usuarioLogueado = false;
        return;
      }
      
      this.usuarioLogueado = true;
      
      // 2. Obtener el ID del usuario del token
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Token inválido');
        return;
      }
      
      const payload = JSON.parse(atob(tokenParts[1]));
      const usuarioId = payload.id;
      
      if (!usuarioId) {
        console.error('Token no contiene ID de usuario');
        return;
      }
      
      // 3. Buscar el carrito del usuario en localStorage
      const carritoKey = `carrito_${usuarioId}`;
      const carritoStr = localStorage.getItem(carritoKey);
      
      if (carritoStr) {
        this.carro = JSON.parse(carritoStr);
        console.log('Carrito cargado:', this.carro);
      } else {
        this.carro = [];
        console.log('El usuario no tiene productos en el carrito');
      }
      
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      this.carro = [];
    }
  }
}
