import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'; 
@Component({
  selector: 'app-login',
  standalone: true, // Componente independiente
  imports: [FormsModule], // FormsModule sigue siendo necesario
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = "";
  password: string = "";

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const loginData = { username: this.username, password: this.password };
    this.http.post(`${environment.apiUrl}/admins/login`, loginData, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          console.log('Login exitoso:', response);
          if (response.admin) { // Verifica 'admin' en lugar de 'user'
            localStorage.setItem('admin', JSON.stringify(response.admin)); // Guarda 'admin' en localStorage
            console.log('Redirigiendo al perfil...');
            this.router.navigate(['/profile']); // Redirige al perfil
          } else {
            console.error('Error: No se recibieron datos del administrador.');
          }
        },
        error: (error) => {
          console.error('Error en el login:', error);
        }
      });
  }
}