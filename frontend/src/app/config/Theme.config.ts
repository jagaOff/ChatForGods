import {UserConfig} from "./User.config";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ThemeConfig {

  constructor(private userConfig: UserConfig) {
    (window as any).theme = {
      devToken: () => this.setDevToken(),
      getConfig: () => this.getUserConfig(),
    };
  }

  private getUserConfig() {
    return this.userConfig.getUserConfig();
  }

  async applyTheme() {
    const theme = await this.getTheme();
    document.body.setAttribute('data-theme', theme);
  }

  async getTheme() {
    const config = await this.userConfig.getUserConfig();
    return config.theme;
  }

  async changeTheme(theme: string) {
    let config = await this.userConfig.getUserConfig();
    config.theme = theme;
    this.userConfig.updateUserConfig(config);
    this.applyTheme();
  }


  async setDevToken() {
    let config = await this.userConfig.getUserConfig();
    config.user_token = "guest-" + Math.random().toString(36);
    this.userConfig.updateUserConfig(config);
  }
}
