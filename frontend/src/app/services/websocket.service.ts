import {Injectable, OnDestroy} from '@angular/core';
import {CompatClient, Stomp, StompHeaders, StompSubscription} from '@stomp/stompjs';
import {WebConfig} from "../config/Web.config";
import {SendTemplate} from "../sendTemplates/sendTemplate";
import {UserConfig} from "../config/User.config";
import {ToastService} from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  connectionStatus!: string;
  headers: StompHeaders = {
    user_token: "",
  }
  private wsUrl = WebConfig.websocketUrl;
  private connection: CompatClient | undefined = undefined;
  private subscription: StompSubscription | undefined;
  private timeOut = 5000;
  private connectionAttempts = 0;
  private maxConnectionAttempts = 2;
  private closeReconnect = false;

  constructor(private userConfig: UserConfig, private toast: ToastService) {

    if (this.userConfig.getUserConfig().user_token == "") {
      this.headers['user_token'] = "guest-" + Math.random().toString(36).substr(2, 9);
    } else {
      this.headers['user_token'] = this.userConfig.getUserConfig().user_token;
    }

    (window as any).web = {
      connect: this.connectToWebSocket.bind(this),
      disconnect: this.closeConnection.bind(this),
      setAttempt: this.setAttempt.bind(this),
    };
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async connectToWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection = Stomp.client(`ws://${this.wsUrl}`);
      this.connection.connect(this.headers, () => {
      });

      this.connection.onConnect = () => {
        this.connectionStatus = 'Connected';
        this.toast.show("info", 'Connected to websocket', {
          closeButton: true,
          timeOut: 3000,
        });
        resolve();
      }

      this.connection.onDisconnect = () => {
        console.log('Disconnected from websocket');
      }

      this.connection.onStompError = () => {
        console.log('Error from websocket');
      }

      this.connection.onWebSocketClose = () => {
        // console.log('Websocket closed');
      }

      this.connection.onWebSocketError = () => {
        this.connectionStatus = 'Could not connect to server';
        this.toast.show("error", 'Could not connect to server', {
          closeButton: true,
          timeOut: 3000,
        });
        reject();
      }
    });


  }

  setAttempt(attempt: number) {
    this.connectionAttempts = attempt;
  }

  closeConnection() {
    this.connection?.disconnect(() => {
      this.connectionStatus = 'Disconnected';
      this.toast.show("info", 'Disconnected from websocket', {
        closeButton: true,
        timeOut: 3000,
      });
      if (this.connection) {
        this.connection.reconnectDelay = 5000;
      }
      // this.reconnect();
    });
  }

  sendMessage(destination: string, template?: SendTemplate, message?: string) {
    if (this.connection?.connected) {
      if (message) {
        this.connection.send(destination, {}, message);
      } else {
        this.connection.send(destination, {}, JSON.stringify(template));
      }

    }
  }

  public subscribe(destination: string, callback: Function): void {
    if (this.connection?.connected) {
      this.subscription = this.connection!.subscribe(destination, message => {
        callback(JSON.parse(message.body));
      });
    }
  }

  private closeReconnectNotification() {
    const element = document.getElementById('toast-info');
    if (element) {
      console.log('Closing element')
      this.toast.closeElement(element)
    }
  }

  private reconnect() {
    this.connectionAttempts++;

    if (this.connectionStatus === 'Connected') {
      this.closeReconnect = true;
      return;
    }


    if (this.connectionAttempts <= this.maxConnectionAttempts) {
      console.log("trying to connect to server: " + this.connectionAttempts);
      setTimeout(() => this.connectToWebSocket(), this.timeOut);
    } else {
      this.closeReconnectNotification()
      this.closeReconnect = true;
      this.connectionStatus = 'Could not connect to server';
      this.toast.show("error", 'Could not connect to server', {
        closeButton: true,
        timeOut: 3000,
      });
    }
  }
}
