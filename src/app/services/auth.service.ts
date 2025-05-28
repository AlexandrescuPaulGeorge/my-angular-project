import { Injectable } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'https://dev-7fmr6s3df361jxdu.us.auth0.com/oauth/token';
  private accessTokenKey = 'accessToken'; // Key for access token in localStorage
  private refreshTokenKey = 'refreshToken'; // Key for refresh token in localStorage

  constructor(private router: Router) {}

  // Login method
  async login(credentials: { username: string; password: string }): Promise<void> {
    const payload = {
      grant_type: 'password',
      username: credentials.username,
      password: credentials.password,
      audience: 'https://dev-7fmr6s3df361jxdu.us.auth0.com/api/v2/',
      scope: 'openid profile email',
      client_id: 'AduSvSpJj6VIxUbdgcJhm0j0irmm5xWj',
      client_secret: 'XmUtHsus2LvCWX_Lb70NRDr8TUInoxfeXAsg3OqkEC7RuITmd9jB98UwL_PKR-Qp',
    };

    try {
      const response = await axios.post(this.authUrl, payload);
      localStorage.setItem(this.accessTokenKey, response.data.access_token);
      localStorage.setItem(this.refreshTokenKey, response.data.refresh_token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Retrieve the access token from localStorage
  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  // Refresh the access token
  async refreshAccessToken(): Promise<void> {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    if (!refreshToken) {
      this.logout();
      throw new Error('Refresh token not available. Please log in again.');
    }

    const payload = {
      grant_type: 'refresh_token',
      client_id: 'AduSvSpJj6VIxUbdgcJhm0j0irmm5xWj',
      refresh_token: refreshToken,
    };

    try {
      const response = await axios.post(this.authUrl, payload);

      // Update the access token in localStorage
      localStorage.setItem(this.accessTokenKey, response.data.access_token);
    } catch (error) {
      console.error('Refresh token error:', error);
      this.logout();
      throw error;
    }
  }

  // Logout method
  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.router.navigate(['/login']);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }
}
