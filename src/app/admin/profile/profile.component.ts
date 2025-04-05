import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { environment } from '../../../environments/environment'; 
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
//primeNG
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule, 
    RouterModule, 
    CommonModule,
    //primeNG modules
    ToolbarModule,
    CardModule,
    ButtonModule,
    DialogModule,
    TableModule,
    InputTextModule,
    CheckboxModule,
    ToastModule,
    TagModule,
    TooltipModule,
    RadioButtonModule
  ], // Asegúrate de importar los módulos necesarios
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService] // Proveedor para el servicio de mensajes
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
  displayDinoDialog: boolean = false; // Controla la visibilidad del diálogo para insertar dinosaurio

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

  constructor(private router: Router, private http: HttpClient, private messageService: MessageService) {}

  ngOnInit() {
    // Recupera los datos del administrador desde el almacenamiento local
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      this.user = JSON.parse(adminData);
    } else {
      // Redirige al login si no hay datos del administrador
      this.router.navigate(['/login']);
    }

    // Obtiene la lista de dinosaurios registrados
    this.getDinos();
  }
  // Obtiene la lista de tamaños de dinos desde el backend
  loadSizes() {
    this.http.get<any[]>(`${environment.apiUrl}/dino-size`).subscribe({
      next: (sizes) => {
        this.sizes = sizes; // Almacena los tamaños obtenidos
      },
      error: (error) => {
        console.error('Error al obtener tamaños:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tamaños de dinosaurios' });
        //alert('No se pudieron cargar los tamaños de dinosaurios');
      }
    });
  }
  openDinoDialog() {
    this.displayDinoDialog = true
    this.loadSizes(); // Carga los tamaños al abrir el diálogo
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
        //alert('No se pudieron cargar los dinosaurios registrados');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los dinosaurios registrados' });
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
    this.generateCommand(); // Genera el comando después de seleccionar el BP
    console.log('BP seleccionado:', bp); // Opcional: Verifica en la consola
    this.messageService.add({ severity: 'info', summary: 'BP seleccionado de dino', detail: `BP seleccionado: ${bp}` });
  }


  // Genera dinámicamente la URL de la imagen
  updateImageUrl() {
    if (this.dino.name) {
      const formattedName = this.dino.name.trim().toLowerCase().replace(/\s+/g, '-');
      this.dino.img = `https://arkids.net/image/creature/120/${formattedName}.png`;
      this.isImageLoading = true; // Marca que la imagen está cargando
      console.log('URL generada:', this.dino.img); 
    } else {
      this.dino.img = 'https://arkids.net/image/creature/120/bunny-oviraptor.png'; // URL por defecto si no hay nombre
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
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Dinosaurio insertado correctamente' });
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al insertar dinosaurio' });
        //alert('Error al insertar dino');
      }
    });
    this.displayDinoDialog = false; // Cierra el diálogo después de insertar
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
        this.messageService.add({ severity: 'success', summary: 'Comando copiado', detail: `El comando ha sido copiado al portapapeles: ${this.generatedCommand}` });
      },
      (err) => {
        console.error('Error al copiar el comando:', err);
        this.messageService.add({ severity: 'error', summary: 'Error al copiar', detail: 'No se pudo copiar el comando al portapapeles' });
      }
    );
  } 
}