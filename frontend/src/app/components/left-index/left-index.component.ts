import {animate, state, style, transition, trigger} from '@angular/animations';
import { Component } from '@angular/core';
import { ThemeConfig } from '../../config/Theme.config';
import { UserConfig } from '../../config/User.config';

@Component({
  selector: 'app-left-index',
  standalone: true,
  imports: [],
  templateUrl: './left-index.component.html',
  styleUrl: './left-index.component.css',

})
export class LeftIndexComponent {

  isMenuVisible = false;
  isDarkTheme!: boolean ;

  constructor(private themeConfig: ThemeConfig,
              private userConfig: UserConfig){
    this.themeConfig.getTheme().then(theme => {
      this.isDarkTheme = theme === 'dark';
    })
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.themeConfig.changeTheme(this.isDarkTheme ? 'dark' : 'light');
  }

  signOut() {
    this.userConfig.signOut();
    window.location.reload();
  }
}
