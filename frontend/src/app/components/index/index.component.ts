import {Component, OnInit} from '@angular/core';
import {WebsocketService} from "../../services/websocket.service";
import {FormsModule} from "@angular/forms";
import {ChatTemplate} from "../../sendTemplates/ChatTemplate";
import {UserConfig} from "../../config/User.config";
import {Router} from "@angular/router";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit {
  message!: string;
  name!: string;
  isNameDisabled = false;
  messages: ChatTemplate[]= [];

  constructor(protected webSocketService: WebsocketService,
              private userConfig: UserConfig,
              private router: Router) {
    if (this.userConfig.getUserConfig().user_token == "") {
      console.log("no token")
      this.router.navigate(['auth']);
    }

    this.name = this.userConfig.getUserConfig().username;

    this.connect();
  }

  ngOnInit() {


  }

  sendMessage() {
    this.webSocketService.sendMessage(
      '/app/chat.sendMessage',
      new ChatTemplate(this.name, this.message,
        new Date().toLocaleDateString(), new Date().toLocaleTimeString()));
    this.message = '';
    this.isNameDisabled = true;
  }

  subscribe() {
    this.webSocketService.subscribe('/topic/public', (message: any) => {
      // console.log("index:" + JSON.stringify(message));
      const msg = JSON.stringify(message);
      const parsed = JSON.parse(msg);

      if(Array.isArray(parsed)){
        parsed.forEach((message: any) => {
          this.messages.push(new ChatTemplate(message.name, message.message, message.date, message.time));
        });
      }



      // message.forEach((message: any) => {
      //   message = JSON.stringify(message);
      //   this.messages.push(new ChatTemplate(message.username, message.message, message.date, message.time));
      //
      // });

      // console.log("Message received: " + this.messages);
      // this.messages.push(new ChatTemplate(message.username, message.message, message.date, message.time));


    });
  }

  async connect() {
    console.log("Connecting to websocket index");
    this.webSocketService.connectToWebSocket().then(() => {
      this.subscribe();
    }, (error) => {
      console.error("Connection failed");
    });

  }

  disconnect() {
    this.webSocketService.closeConnection();
  }
}
