import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UserConfig} from "./config/User.config";
import {ThemeConfig} from './config/Theme.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';


  constructor(private userConfig: UserConfig, private themeConfig: ThemeConfig) {

    // if userConfig.getUserConfig() is empty, create a new one
    if (Object.keys(userConfig.getUserConfig()).length === 0) {
      userConfig.createUserConfig();
    }

    // themeConfig.changeTheme("dark")
    themeConfig.applyTheme();
  }
}
