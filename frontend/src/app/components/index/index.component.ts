import {Component, HostListener, OnInit} from '@angular/core';
import {WebsocketService} from "../../services/websocket.service";
import {FormsModule} from "@angular/forms";
import {ChatTemplate} from "../../sendTemplates/ChatTemplate";
import {UserConfig} from "../../config/User.config";
import {Router} from "@angular/router";
import {NgForOf} from "@angular/common";
import {ThemeConfig} from '../../config/Theme.config';
import {ToastService} from '../../services/toast.service';
import {LeftIndexComponent} from "../left-index/left-index.component";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    LeftIndexComponent,
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit {
  messages: ChatTemplate[] = [];

  constructor(protected webSocketService: WebsocketService,
              private userConfig: UserConfig,
              private themeConfig: ThemeConfig,
              private toast: ToastService,
              private router: Router) {
    if (this.userConfig.getUserConfig().user_token == "") {
      this.router.navigate(['auth']);
    }

    this.webSocketService.connectToWebSocket().then(() => {
      this.subscribe();
    });

    // this.name = this.userConfig.getUserConfig().username;
    this.themeConfig.changeTheme(this.userConfig.getUserConfig().theme);


  }

  ngOnInit() {


  }

  sendMessage() {
    // this.webSocketService.sendMessage(
    //   '/app/chat.sendMessage',
    //   new ChatTemplate(this.name, this.message,
    //     new Date().toLocaleDateString(), new Date().toLocaleTimeString()));
  }

  subscribe() {
    this.webSocketService.subscribe('/topic/public', (message: any) => {
      // console.log("index:" + JSON.stringify(message));
      const msg = JSON.stringify(message);
      const parsed = JSON.parse(msg);

      this.messages = [];

      if (Array.isArray(parsed)) {
        parsed.forEach((message: any) => {
          this.messages.push(new ChatTemplate(message.name, message.message, message.date, message.time));
        });
      }
    });
  }



}
