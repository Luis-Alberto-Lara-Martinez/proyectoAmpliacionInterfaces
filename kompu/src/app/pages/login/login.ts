import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { Usuarios } from '../../services/usuarios/usuarios';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  clave: string = '';

  constructor(private servicio: Usuarios) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.servicio.obtenerUsuarios().subscribe({
      next: listaUsuarios => {
        if (typeof window !== 'undefined') {
          localStorage.setItem("listaUsuarios", JSON.stringify(listaUsuarios));
        }
      }
    });
  }

  onLogin() {
    this.servicio.iniciarSesion(this.email, this.clave).subscribe({
      next: token => {
        alert("Token JWT: " + token);
      },
      error: err => {
        if (err.status === 403) {
          alert("Error: No se pudo acceder a la lista de usuarios.");
          this.cargarUsuarios();
          return;
        }

        if (err.status === 401) {
          alert("Error: Credenciales incorrectas.");
          return;
        }
      }
    });
  }
}