import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import emailjs from '@emailjs/browser';
import { UsuariosService } from '../../services/usuarios/usuarios-service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  cargando: boolean = false;
  error: string = "";
  usuarioRecuperaClave: string = "";

  // Nueva variable para el token de reseteo
  tokenResetearClave: string | null = null;

  email: string = "";
  clave: string = "";
  nuevaClave: string = ""; // Para el nuevo campo de clave

  constructor(
    private servicio: UsuariosService,
    private router: Router,
    private route: ActivatedRoute // Inyectar ActivatedRoute
  ) { }
  ngOnInit() {
    this.cargarUsuarios();

    this.route.queryParams.subscribe(params => {
      this.tokenResetearClave = params['tokenResetearClave'] || null;
    });
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
    this.cargando = true;
    this.usuarioRecuperaClave = "";
    this.servicio.iniciarSesion(this.email, this.clave).subscribe({
      next: token => {
        this.cargando = false;
        localStorage.setItem("token", token);
        this.router.navigate(['/home']);
      },
      error: err => {
        if (err.status === 403) {
          this.cargando = false;
          this.error = "Error: lista de usuarios no existente. Se recargará la lista y vuelva a intentarlo.";
          this.cargarUsuarios();
          return;
        }

        if (err.status === 401) {
          this.cargando = false;
          this.error = "Email y/o clave incorrectos";
          return;
        }
      }
    });
  }

  onChangePassword() {
    // Implementar la lógica para cambiar la clave usando this.nuevaClave y this.tokenResetearClave
    console.log('Cambiando clave con token:', this.tokenResetearClave, 'y nueva clave:', this.nuevaClave);
    // Aquí iría la llamada al servicio para cambiar la clave
  }

  recuperarClave() {
    let cifradoRecuperacionClave = btoa("");
    this.usuarioRecuperaClave = "";
    // const templateParams = {
    //   email: "luisalbertolaramartinez3c@gmail.com",
    //   nombre: "Luis Alberto",
    //   linkWeb: "https://kompu.vercel.app",
    //   urlLogo: "https://kompu.vercel.app/assets/images/icons/kompu.png"
    // };

    // emailjs.send(
    //   'servicio_correo_kompu',    // tu service_id
    //   'plantilla_bienvenida',   // tu template_id
    //   templateParams,
    //   'UXLui2Yw1nIYtD-OL'        // clave pública
    // )
    //   .then((response) => {
    //     this.usuarioRecuperaClave = "Correo enviado exitosamente";
    //   })
    //   .catch((err) => {
    //     this.usuarioRecuperaClave = "Error al enviar el correo";
    //   });
  }
}