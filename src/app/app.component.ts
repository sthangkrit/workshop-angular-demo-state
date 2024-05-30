import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
  ) {}
  getUserFullName() {
    if (this.isAuthenticated()) {
      return this.storageService.getUserFullName();
    } else {
      return '';
    }
  }

  isAuthenticated() {
    return this.storageService.isLoggedIn();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
