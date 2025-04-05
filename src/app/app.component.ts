import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private primeng: PrimeNG) {}
  ngOnInit() {
    this.primeng.ripple.set(true);
  }
  title = 'valion-admin-web';
  
  isDarkMode: boolean = false; // Controla el modo oscuro
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode; // Alterna el estado del modo oscuro
    const element = document.querySelector('html');
    if (this.isDarkMode) {
      element?.classList.add('valion-admin-web-dark'); // Aplica la clase para el modo oscuro
    } else {
      element?.classList.remove('valion-admin-web-dark'); // Elimina la clase para el modo oscuro
    }
  }
}
