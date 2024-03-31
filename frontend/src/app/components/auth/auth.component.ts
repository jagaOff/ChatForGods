import {Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {WebsocketService} from '../../services/websocket.service';
import {ChatTemplate} from "../../sendTemplates/ChatTemplate";
import {AuthTemplate} from "../../sendTemplates/auth/AuthTemplate";
import {FormsModule} from "@angular/forms";

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

  constructor(protected webSocketService: WebsocketService) {
    webSocketService.connectToWebSocket().then(r => {
      this.subscribe()
    });
  }

  subscribe(){
    this.webSocketService.subscribe('/topic/auth', (message: any) => {
      console.log(message.body);
    });
  }

  login() {

    if(this.username === '' || this.password === ''){
      //TODO: show error message

      return;
    }

    this.webSocketService.sendMessage(
      '/app/auth/login',
      new AuthTemplate(this.username, this.password));
  }

  register() {
    if(this.username === '' || this.password === '' || this.password !== this.passwordRep){

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
