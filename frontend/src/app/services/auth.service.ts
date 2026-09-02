import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface Usuario {
  id: string;
  email: string;
  name: string;
}

interface RespuestaLogin {
  token: string;
  user: Usuario;
}

interface TokenPayload {
  id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly URL_API = 'http://localhost:3000/api/auth';
  private readonly CLAVE_TOKEN = 'auth_token';
  private readonly TIEMPO_INACTIVIDAD_MS = 30 * 60 * 1000; // 30 minutos

  private usuarioActual = signal<Usuario | null>(null);
  private temporizadorInactividad: any = null;
  private escuchasActivas = false;

  usuario = computed(() => this.usuarioActual());
  estaAutenticado = computed(() => !!this.usuarioActual());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.verificarSesionExistente();
  }

  login(email: string, password: string): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(`${this.URL_API}/login`, { email, password })
      .pipe(
        tap(respuesta => {
          localStorage.setItem(this.CLAVE_TOKEN, respuesta.token);
          this.usuarioActual.set(respuesta.user);
          this.iniciarVigilanciaInactividad();
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.CLAVE_TOKEN);
    this.usuarioActual.set(null);
    this.detenerVigilanciaInactividad();
    this.router.navigate(['/login']);
  }

  sesionExpirada(): void {
    localStorage.removeItem(this.CLAVE_TOKEN);
    this.usuarioActual.set(null);
    this.detenerVigilanciaInactividad();
    this.router.navigate(['/session-expired']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.CLAVE_TOKEN);
  }

  private verificarSesionExistente(): void {
    const token = localStorage.getItem(this.CLAVE_TOKEN);
    if (token) {
      try {
        const decodificado = jwtDecode<TokenPayload>(token);
        const ahora = Date.now() / 1000;

        if (decodificado.exp > ahora) {
          this.usuarioActual.set({
            id: decodificado.id,
            email: decodificado.email,
            name: decodificado.name
          });
          this.iniciarVigilanciaInactividad();
        } else {
          // Token ya caducado (por ejemplo un token viejo): se limpia y se manda
          // al login para que el usuario vuelva a entrar y llegue al dashboard.
          this.logout();
        }
      } catch {
        this.logout();
      }
    }
  }

  /**
   * Vigila la inactividad del usuario. El temporizador de 30 minutos se
   * reinicia con cada interaccion (mover el raton, teclear, hacer click).
   * Si el usuario esta activo, nunca se expulsa la sesion.
   */
  private iniciarVigilanciaInactividad(): void {
    if (!this.escuchasActivas) {
      this.escuchasActivas = true;
      this.registrarEscuchas();
    }
    this.reiniciarTemporizador();
  }

  private registrarEscuchas(): void {
    const eventos = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    eventos.forEach(evento => {
      window.addEventListener(evento, () => this.reiniciarTemporizador(), { passive: true });
    });
  }

  private reiniciarTemporizador(): void {
    if (!this.usuarioActual()) return;

    this.detenerTemporizador();
    this.temporizadorInactividad = setTimeout(() => {
      this.sesionExpirada();
    }, this.TIEMPO_INACTIVIDAD_MS);
  }

  private detenerTemporizador(): void {
    if (this.temporizadorInactividad) {
      clearTimeout(this.temporizadorInactividad);
      this.temporizadorInactividad = null;
    }
  }

  private detenerVigilanciaInactividad(): void {
    this.detenerTemporizador();
  }
}
