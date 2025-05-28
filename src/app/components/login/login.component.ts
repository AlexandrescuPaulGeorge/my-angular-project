import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, RouterModule],
})
export class LoginComponent {
  credentials = { username: '', password: '' };

  constructor(private router: Router, private authService: AuthService) {}

  async onSubmit() {
    try {
      await this.authService.login(this.credentials);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Login error:', error);
    }
  }
}
