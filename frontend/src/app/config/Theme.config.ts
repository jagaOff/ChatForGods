import {UserConfig} from "./User.config";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ThemeConfig {

  constructor(private userConfig: UserConfig) {

  }

  applyTheme() {
    document.body.setAttribute('data-theme', this.getTheme());
  }

  getTheme() {
    return this.userConfig.getUserConfig().theme;
  }

  changeTheme(theme: string) {
    let config = this.userConfig.getDefaultConfig();
    config.theme = theme;
    this.userConfig.updateUserConfig(config);
    this.applyTheme();
  }
}
