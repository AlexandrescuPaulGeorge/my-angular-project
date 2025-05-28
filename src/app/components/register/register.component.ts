import { Component } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, RouterModule],
})
export class RegisterComponent {
  user = { username: '', password: '' };

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    this.registerWithAuth0(this.user.username, this.user.password)
      .then((auth0Id) => {
        return this.userService
          .registerUser(auth0Id, this.user.username)
          .toPromise();
      })
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((err) => console.error('Registration failed:', err));
  }

  async registerWithAuth0(username: string, password: string): Promise<string> {
    try {
      const response = await axios.post(
        `https://dev-7fmr6s3df361jxdu.us.auth0.com/dbconnections/signup`,
        {
          connection: 'MyChatApplication',
          client_id: 'AduSvSpJj6VIxUbdgcJhm0j0irmm5xWj',
          username: username,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // console.log("Registration response is :",response)
      if (response.status === 200 && response.data._id) {
        //  console.log('User successfully registered with Auth0');
        return response.data._id; // Return the _id field from the response
      } else {
        throw new Error('Unexpected response from Auth0');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(
          'Registration failed:',
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error('Unexpected error:', err.message);
      } else {
        console.error('An unknown error occurred:', err);
      }
      throw err;
    }
  }
}
