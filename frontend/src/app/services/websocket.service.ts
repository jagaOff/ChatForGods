import {Injectable, OnDestroy} from '@angular/core';
import {CompatClient, Stomp, StompSubscription} from '@stomp/stompjs';
import {WebConfig} from "../config/Web.config";
import {ChatTemplate} from "../chatSendTemplates/ChatTemplate";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  connectionStatus!: string;
  private wsUrl = WebConfig.websocketUrl;

  private connection: CompatClient | undefined = undefined;

  private subscription: StompSubscription | undefined;

  constructor() {
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
    this.connection.connect({}, () => {
      this.connectionStatus = 'Connected';
    });
  }

  closeConnection() {
    this.connection?.disconnect(() => {
      this.connectionStatus = 'Disconnected';
    });
  }

  sendMessage(chatTemplate: ChatTemplate) {
    if (this.connection && this.connection.connected) {
      this.connection.send('/app/chat.sendMessage', {}, JSON.stringify(chatTemplate));
    }
  }

  /*subscribe(callback: Function) {
    this.stompClient.subscribe('/topic/public', (message: any) => {
      // callback(JSON.parse(message.body));
    });
  }*/

  public subscribe(callback: Function): void {
    if (this.connection) {
      this.connection.connect({}, () => {
        this.subscription = this.connection!.subscribe('/topic/public', message => {
          callback(JSON.parse(message.body))
        });
      });
    }
  }
}
