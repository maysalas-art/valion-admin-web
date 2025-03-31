import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule], // Asegúrate de importar los módulos necesarios
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any; // Datos del administrador
  dino = {
    name: '',
    bp: '',
    specialPrice: 0,
    size: '',
    claimable: false,
    img: ''
  }; // Datos del dinosaurio a insertar

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // Recupera los datos del administrador desde el almacenamiento local
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      this.user = JSON.parse(adminData);
    } else {
      // Redirige al login si no hay datos del administrador
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('admin'); // Elimina los datos del administrador
    this.router.navigate(['/login']); // Redirige al login
  }

  onSubmitDino() {
    // Envía los datos del dinosaurio al backend
    this.http.post('http://localhost:3000/dino', this.dino).subscribe({
      next: (response) => {
        console.log('Dinosaurio insertado:', response);
        alert('Dinosaurio insertado correctamente');
        // Limpia el formulario después de insertar
        this.dino = {
          name: '',
          bp: '',
          specialPrice: 0,
          size: '',
          claimable: false,
          img: ''
        };
      },
      error: (error) => {
        console.error('Error al insertar dinosaurio:', error);
        alert('Error al insertar dinosaurio');
      }
    });
  }
}