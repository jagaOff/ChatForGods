import {UserConfig} from "./User.config";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ThemeConfig {

  constructor(private userConfig: UserConfig) {
    (window as any).theme = {
      devToken: () => this.setDevToken(),
    };
  }

  applyTheme() {
    document.body.setAttribute('data-theme', this.getTheme());
  }

  getTheme() {
    return this.userConfig.getUserConfig().theme;
  }

  changeTheme(theme: string) {
    let config = this.userConfig.getUserConfig();
    config.theme = theme;
    this.userConfig.updateUserConfig(config);
    this.applyTheme();
  }

  setDevToken(){
    let config = this.userConfig.getUserConfig();
    config.user_token = "guest-" + Math.random().toString(36);
    this.userConfig.updateUserConfig(config);
  }
}
