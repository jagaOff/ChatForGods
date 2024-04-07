import {Component} from '@angular/core';
import {ThemeConfig} from '../../config/Theme.config';
import {UserConfig} from '../../config/User.config';
import {WebsocketService} from '../../services/websocket.service';
import {MessageTemplate} from '../../sendTemplates/MessageTemplate';

@Component({
  selector: 'app-left-index',
  standalone: true,
  imports: [],
  templateUrl: './left-index.component.html',
  styleUrl: './left-index.component.css',

})
export class LeftIndexComponent {

  isDarkTheme!: boolean;
  chats: any[] = [];

  constructor(private themeConfig: ThemeConfig,
              private webSocketService: WebsocketService,
              private userConfig: UserConfig) {
    // this.themeConfig.getTheme().then(theme => {
    //   this.isDarkTheme = theme === 'dark';
    // })

    this.webSocketService.connectToWebSocket().then(() => {
      this.subscribe()
    });
  }

  protected toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.themeConfig.changeTheme(this.isDarkTheme ? 'dark' : 'light');
  }

  protected signOut() {
    this.userConfig.signOut();
    window.location.reload();
  }

  protected onInputChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.sendMessage(inputValue);
  }

  private subscribe() {
    this.webSocketService.subscribe(`/topic/${this.userConfig.getUserConfig().username}`, (message: any) => {
      if (message.status >= 200 && message.status <= 300) {
        let parsedMessage = JSON.parse(message.message);
        this.chats = parsedMessage.map((item: any) => item.username);
      }
      if (message.status >= 400 && message.status <= 500) {
        this.chats = [];
      }
    });
  }

  private sendMessage(message: string) {
    this.chats = [];
    this.webSocketService.sendMessage(`/app/chatlist/search`,
      new MessageTemplate(message, this.userConfig.getUserConfig().username));
  }


}
