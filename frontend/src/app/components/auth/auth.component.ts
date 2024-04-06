import {Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {WebsocketService} from '../../services/websocket.service';
import {ChatTemplate} from "../../sendTemplates/ChatTemplate";
import {AuthTemplate} from "../../sendTemplates/auth/AuthTemplate";
import {FormsModule} from "@angular/forms";
import {UserConfig} from "../../config/User.config";
import {Router} from "@angular/router";
import {routes} from "../../app.routes";
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  isLogin = true;
  username = '';
  password = '';
  passwordRep = '';

  constructor(protected webSocketService: WebsocketService,
              private userConfig: UserConfig,
              private toast: ToastService,
              private router: Router) {
    webSocketService.connectToWebSocket().then(r => {
      console.log("Connected to WebSocket auth");
      this.subscribe()
    });
  }

  subscribe(){
    this.webSocketService.subscribe('/topic/auth', (message: any) => {

      if(message.status >= 200 && message.status <= 300){
        this.webSocketService.headers['user_token'] = message.token;
        let config = this.userConfig.getUserConfig();
        config.user_token = message.token;
        config.username = message.username;
        this.userConfig.updateUserConfig(config);
        this.toast.show("success", "Successfully logged in", {
          timeOut: 3000,
          closeButton: true
        });

        console.log("Successfully logged in");

        this.webSocketService.closeConnection();
        //navigate to "/"
        this.router.navigate(['']);
      }

      if(message.status >= 400 && message.status <= 500){
        this.toast.show("error", message.message, {
          timeOut: 3000,
          closeButton: true
        });
      }
    });
  }

  login() {

    if(this.username === '' || this.password === ''){
      this.toast.show("error", "Username or password is empty");

      return;
    }

    this.webSocketService.sendMessage(
      '/app/auth/login',
      new AuthTemplate(this.username, this.password));
  }

  register() {
    if(this.username === '' || this.password === '' || this.password !== this.passwordRep){
      this.toast.show("error", "Username or password is empty");
      return;
    }

    this.webSocketService.sendMessage(
      '/app/auth/register',
      new AuthTemplate(this.username, this.password));
  }

  switchMode() {
    this.isLogin = !this.isLogin;
    this.username = '';
    this.password = '';
  }
}
