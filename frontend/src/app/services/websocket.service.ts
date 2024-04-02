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
    /*this.connection = Stomp.client(`ws://${this.wsUrl}`);
    this.connection.connect({}, () => {
    });*/
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async connectToWebSocket() {
    this.connection = Stomp.client(`ws://${this.wsUrl}`);
    this.connection.connect(this.headers, () => {

    });



    if (this.connection?.connected) {
      this.connectionAttempts = 0;
      this.connectionStatus = 'Connected';
      this.toast.show("success", 'Connected to websocket', {
        closeButton: true,
        timeOut: 3000,
      });
    } else {
      if (!this.closeReconnect) {
        this.closeReconnectNotification()
        this.toast.show("info", "Trying to connect to websocket", {
          isClosable: false,
          customIcon: '<img src="assets/img/svg/loading.svg" alt="Star Icon" />',
        });
        this.reconnect();
      }
    }
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
      // this.reconnect();
    });
  }

  sendMessage(destination: string, template: SendTemplate) {
    if (this.connection && this.connection.connected) {
      console.log('Sending message');
      this.connection.send(destination, {}, JSON.stringify(template));
    } else {
      console.error('Websocket is not connected');
    }
  }

  public subscribe(destination: string, callback: Function): void {
    if (this.connection) {
      this.connection.connect({}, () => {
        this.subscription = this.connection!.subscribe(destination, message => {
          callback(JSON.parse(message.body));
        });
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

  /*subscribe(callback: Function) {
    this.stompClient.subscribe('/topic/public', (message: any) => {
      // callback(JSON.parse(message.body));
    });
  }*/

  private reconnect() {
    this.connectionAttempts++;


    if (this.connectionAttempts <= this.maxConnectionAttempts) {
      console.log("trying to connect to websocket: " + this.connectionAttempts);
      setTimeout(() => this.connectToWebSocket(), this.timeOut);
    } else {
      this.closeReconnectNotification()
      this.closeReconnect = true;
      this.connectionStatus = 'Could not connect to websocket';
      this.toast.show("error", 'Could not connect to websocket', {
        closeButton: true,
        timeOut: 3000,
      });
    }
  }
}
