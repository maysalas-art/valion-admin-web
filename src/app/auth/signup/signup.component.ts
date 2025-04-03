import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'; 
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule], // Importar FormsModule para usar [(ngModel)]
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  username: string = '';
  eos: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSignup() {
    const signupData = {
      name: this.name,
      username: this.username,
      eos: this.eos,
      password: this.password,
    };

    this.http.post(`${environment.apiUrl}/admins/signup`, signupData)
      .subscribe({
        next: (response: any) => {
          console.log('Registro exitoso:', response);
          if (response.admin) { // Verifica 'admin' en lugar de 'user'
            localStorage.setItem('admin', JSON.stringify(response.admin)); // Guarda 'admin' en localStorage
            this.router.navigate(['/profile']); // Redirige al perfil
          } else {
            console.error('Error: No se recibieron datos del administrador.');
          }
        },
        error: (error) => {
          console.error('Error en el registro:', error);
        }
      });
  }
}