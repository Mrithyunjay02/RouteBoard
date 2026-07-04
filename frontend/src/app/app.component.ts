import { Component, HostListener } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  constructor(private authService: AuthService, private router: Router) {}

  @HostListener('window:pageshow', ['$event'])
  onPageShow(event: PageTransitionEvent) {
    if (event.persisted && !this.authService.isAuthenticated()) {
      // The page was restored from BFCache (back/forward button)
      // but the user is not authenticated anymore.
      this.router.navigate(['/login']);
    }
  }
}
