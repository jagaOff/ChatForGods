import {Component, OnInit} from '@angular/core';
import {WebsocketService} from "../../services/websocket.service";
import {FormsModule} from "@angular/forms";
import {ChatTemplate} from "../../chatSendTemplates/ChatTemplate";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {
  message!: string;
  name!: string;
  isNameDisabled = false;

  constructor(protected webSocketService: WebsocketService) {
    this.connect();
  }

  ngOnInit() {
  }

  sendMessage() {
    this.webSocketService.sendMessage(
      new ChatTemplate(this.name, this.message,
        new Date().toLocaleDateString(), new Date().toLocaleTimeString()));
    this.message = '';
    this.isNameDisabled = true;
  }

  subscribe() {
    this.webSocketService.subscribe((message: any) => {
      console.log(message.body);
    });
  }

  async connect() {
    this.webSocketService.connectToWebSocket().then(() => {
      this.subscribe();
    });

  }

  disconnect() {
    this.webSocketService.closeConnection();
  }
}
