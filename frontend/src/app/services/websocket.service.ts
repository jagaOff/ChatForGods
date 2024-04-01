import {Injectable, OnDestroy} from '@angular/core';
import {CompatClient, Stomp, StompHeaders, StompSubscription} from '@stomp/stompjs';
import {WebConfig} from "../config/Web.config";
import {SendTemplate} from "../sendTemplates/sendTemplate";
import {UserConfig} from "../config/User.config";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  connectionStatus!: string;
  private wsUrl = WebConfig.websocketUrl;

  private connection: CompatClient | undefined = undefined;

  private subscription: StompSubscription | undefined;

  headers: StompHeaders = {
    user_token: "",
  }

  constructor(private userConfig: UserConfig) {

    if(this.userConfig.getUserConfig().user_token == ""){
      this.headers['user_token'] = "guest-" + Math.random().toString(36).substr(2, 9);
    } else {
      this.headers['user_token'] = this.userConfig.getUserConfig().user_token;
    }


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
      console.log('Connected to websocket');
      this.connectionStatus = 'Connected';
    } else {
      console.error('Could not connect to websocket');
      this.connectionStatus = 'Could not connect to websocket';
    }
  }

  closeConnection() {
    this.connection?.disconnect(() => {
      this.connectionStatus = 'Disconnected';
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

  /*subscribe(callback: Function) {
    this.stompClient.subscribe('/topic/public', (message: any) => {
      // callback(JSON.parse(message.body));
    });
  }*/

  public subscribe(destination: string, callback: Function): void {
    if (this.connection) {
      this.connection.connect({}, () => {
        this.subscription = this.connection!.subscribe(destination, message => {
          callback(JSON.parse(message.body));
        });
      });
    }
  }
}
