import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {UserConfig} from "./config/User.config";
import {ThemeConfig} from './config/Theme.config';
import {WebsocketService} from "./services/websocket.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';


  constructor(private userConfig: UserConfig,
              private themeConfig: ThemeConfig,
              protected webSocketService: WebsocketService,
              ) {


    if(userConfig.getUserConfig() === null) {
      userConfig.createUserConfig();
    }

   /* if(userConfig.getUserConfig().user_token === "") {
      let config = userConfig.getUserConfig();
      config.user_token = "guest-" + Math.random().toString(36).substr(2, 9);
      userConfig.updateUserConfig(config);
    }
*/
    themeConfig.applyTheme();
  }
}
