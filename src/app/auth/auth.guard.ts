import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  if (typeof window !== 'undefined' && localStorage) { // Verifica si localStorage está disponible
    const admin = localStorage.getItem('admin'); // Verifica si el usuario está autenticado
    console.log('AuthGuard ejecutado. Admin encontrado:', admin); // Agrega este log para depurar
    if (admin) {
      return true; // Permite el acceso si el usuario está autenticado
    } else {
      const router = new Router(); // Redirige al login si no está autenticado
      router.navigate(['/login']);
      return false;
    }
  } else {
    console.error('localStorage no está disponible.');
    return false; // Bloquea el acceso si localStorage no está disponible
  }
};