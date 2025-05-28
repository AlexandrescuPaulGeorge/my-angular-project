import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  constructor(private authService: AuthService) {}

  initializeConnection(): Promise<void> {
    if (
      this.hubConnection &&
      this.hubConnection.state === signalR.HubConnectionState.Connected
    ) {
      return Promise.resolve();
    }
    const token = this.authService.getAccessToken();

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        'https://my-dotnet-api.icysea-9e4aeb5a.polandcentral.azurecontainerapps.io/chatHub',
        {
          accessTokenFactory: () => token || '',
        }
      )
      .withAutomaticReconnect()
      .build();

    return this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch((err) => console.error('SignalR Connection Error: ', err));
  }

  on(eventName: string, callback: (...args: any[]) => void): void {
    if (this.hubConnection) {
      this.hubConnection.on(eventName, callback);
    }
  }

  invoke(methodName: string, ...args: any[]): Promise<void> {
    if (this.hubConnection) {
      return this.hubConnection.invoke(methodName, ...args);
    }
    return Promise.reject('HubConnection is not initialized');
  }

  stopConnection(): Promise<void> {
    if (this.hubConnection) {
      return this.hubConnection
        .stop()
        .then(() => console.log('SignalR Disconnected'));
    }
    return Promise.resolve();
  }

  joinGroup(groupId: string): Promise<void> {
    return this.invoke('JoinRoom', groupId);
  }
  leaveGroup(groupId: string): Promise<void> {
    return this.invoke('LeaveRoom', groupId);
  }
}
