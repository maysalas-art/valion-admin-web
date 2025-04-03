import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { environment } from '../../../environments/environment'; 
import { CommonModule } from '@angular/common';
import { get } from 'http';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule, CommonModule], // Asegúrate de importar los módulos necesarios
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any; // Datos del administrador
  sizes: any[] = []; // Lista de tamaños de dinosaurios
  dinos: any[] = []; // Lista de dinosaurios registrados
  isImageLoading: boolean = true; // Controla si la imagen está cargando
  searchQuery: string = ''; // Consulta de búsqueda para filtrar dinosaurios
  filteredDinos: any[] = []; // Lista filtrada de dinosaurios
  selectedDinoId: string | null = null; // ID del dinosaurio seleccionado
  generatedCommand: string = ''; // Comando generado dinámicamente

  
  // Modelo para el formulario de comandos
  commandDino = {
    bp: '',
    stat1: '',
    stat2: '',
    stat3: ''
  };

  // Modelo para el formulario de insertar dinosaurio
  dino = {
    name: '',
    bp: '',
    specialPrice: 0,
    size: '',
    claimable: false,
    img: ''
  };

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

    // Obtiene la lista de tamaños de dinos desde el backend
    this.http.get<any[]>(`${environment.apiUrl}/dino-size`).subscribe({
      next: (sizes) => {
        this.sizes = sizes; // Almacena los tamaños obtenidos
      },
      error: (error) => {
        console.error('Error al obtener tamaños:', error);
        alert('No se pudieron cargar los tamaños de dinosaurios');
      }
    });
    // Obtiene la lista de dinosaurios registrados
    this.getDinos();
  }

  //Mostrar lista de dinos registrados
  getDinos() {
    this.http.get<any[]>(`${environment.apiUrl}/dino`).subscribe({
      next: (dinos) => {
        this.dinos = dinos; // Almacena los dinosaurios obtenidos
        this.filteredDinos = dinos; // Inicializa la lista filtrada
      },
      error: (error) => {
        console.error('Error al obtener dinosaurios:', error);
        alert('No se pudieron cargar los dinosaurios registrados');
      }
    });
  }
  //mostrar dinos filtrados por búsqueda
  filterDinos() {
    const query = this.searchQuery.toLowerCase();
    this.filteredDinos = this.dinos.filter((dino) =>
      dino.name.toLowerCase().includes(query)
    );
  }


   // Método para seleccionar el BP del dinosaurio
   selectDinoBP(bp: string) {
    this.commandDino.bp = bp; // Actualiza el campo BP en el formulario
    console.log('BP seleccionado:', bp); // Opcional: Verifica en la consola
  }


  // Genera dinámicamente la URL de la imagen
  updateImageUrl() {
    if (this.dino.name) {
      const formattedName = this.dino.name.trim().toLowerCase().replace(/\s+/g, '-');
      this.dino.img = `https://arkids.net/image/creature/120/${formattedName}.png`;
      this.isImageLoading = true; // Marca que la imagen está cargando
      console.log('URL generada:', this.dino.img); 
    } else {
      this.dino.img = 'https://picsum.photos/300/300';
      this.isImageLoading = false;
    }
  }

  // Método para manejar el evento de carga exitosa de la imagen
  onImageLoad() {
    this.isImageLoading = false; // La imagen se cargó correctamente
    console.log('Imagen cargada correctamente:', this.dino.img);
  }

  // Método para manejar el evento de error al cargar la imagen
  onImageError() {
    this.isImageLoading = false;
    console.log('Error al cargar la imagen:', this.dino.img);
  }
  //para cerrar sesión
  logout() {
    localStorage.removeItem('admin'); // Elimina los datos del administrador
    this.router.navigate(['/login']); // Redirige al login
  }
  //para insertar dinos nuevos
  onSubmitDino() {
    //console.log('Datos enviados al backend:', this.dino);
    // Envía los datos del dinosaurio al backend
    this.http.post(`${environment.apiUrl}/dino`, this.dino).subscribe({
      next: (response) => {
        console.log('Dino insertado:', response);
        alert('Dino insertado correctamente');
        // Limpia el formulario después de insertar
        this.dino = {
          name: '',
          bp: '',
          specialPrice: 0,
          size: '',
          claimable: false,
          img: ''
        };
        this.getDinos(); // Actualiza la lista de dinosaurios
      },
      error: (error) => {
        console.error('Error al insertar dino:', error);
        alert('Error al insertar dino');
      }
    });
  }
  //para seleccionar el tamaño del dino
  selectSize(sizeId: string) {
    this.dino.size = sizeId; // Asigna solo el ID del tamaño seleccionado
  }
  // Método para generar el comando
  generateCommand() {
    const eos = this.user?.eos || 'error';
    const bp = this.commandDino.bp || 'error';
    const stat1 = this.commandDino.stat1 || '0';
    const stat2 = this.commandDino.stat2 || '0';
    const stat3 = this.commandDino.stat3 || '0';
  
    this.generatedCommand = `SpawnDino_SCS ${eos} ${bp} 0 100 0 1 0 "${stat1},${stat2},0,45,45,${stat3},0,0" 0 "1,2,3,4,5,6"`;
  }

  // Método para copiar el comando al portapapeles
  copyCommand() {
    navigator.clipboard.writeText(this.generatedCommand).then(
      () => {
        alert(`Comando copiado al portapapeles: ${this.generatedCommand}`);
      },
      (err) => {
        console.error('Error al copiar el comando:', err);
      }
    );
  } 
}