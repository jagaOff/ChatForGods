import {Component, OnInit} from '@angular/core';
import {WebsocketService} from "../../services/websocket.service";
import {FormsModule} from "@angular/forms";
import {ChatTemplate} from "../../sendTemplates/ChatTemplate";
import {UserConfig} from "../../config/User.config";
import {Router} from "@angular/router";
import {NgForOf} from "@angular/common";
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
              private router: Router,
              private toast: ToastService) {

    if (this.userConfig.getUserConfig().user_token == "") {
      this.router.navigate(['auth']);
    }

    this.webSocketService.connectToWebSocket().then(() => {
      this.subscribe();
      this.webSocketService.sendMessage(`/app/auth/JWT`, this.userConfig.getUserConfig().user_token);
    });
  }

  ngOnInit() {


  }


  subscribe() {
    this.webSocketService.subscribe(`/topic/${this.userConfig.getUserConfig().user_token}`, (message: any) => {
      console.log("message: " + JSON.stringify(message));
      if (message.status >= 200 && message.status <= 300) {
        this.toast.show("success", message.message, {
          timeOut: 3000,
          closeButton: true
        });
      }
      if (message.status >= 400 && message.status <= 500) {
        let config = this.userConfig.getUserConfig()
        config.user_token = message.message;
        this.userConfig.updateUserConfig(config);
        // reopen subscription
        this.webSocketService.unsubscribe();
        this.subscribe();
      }
    });
  }


}
