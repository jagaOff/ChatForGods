import {Injectable} from "@angular/core";
import CryptoJS from 'crypto-js';
import { SecurityService } from "../services/security.service";

export const UserConfigSettings = {
  "user_token": "",
  "username": "",
  "theme": "light",
  "language": "en",
}


@Injectable({
  providedIn: 'root'
})
export class UserConfig {


  constructor(private securityService: SecurityService) {
  }

// const secretKey = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);


  createUserConfig() {
    // const encryptedToken = this.encryptToken(UserConfigSettings.user_token);
    // const configWithEncryptedToken = {...UserConfigSettings, user_token: encryptedToken};
    localStorage.setItem('user_config', JSON.stringify(UserConfigSettings));
  }


  getUserConfig() {
    // return JSON.parse(localStorage.getItem('user_config') || '{}');

    const configString = localStorage.getItem('user_config');

    if (!configString) return null

    const config = JSON.parse(configString);
    if (config.user_token) {
      config.user_token = this.securityService.decryptToken(config.user_token);
    }
    return config;
  }

  getDefaultConfig() {
    return UserConfigSettings;
  }


  updateUserConfig(config: any) {
    localStorage.removeItem('user_config')
    if (config.user_token) {
      config.user_token = this.securityService.encryptToken(config.user_token);
    }
    localStorage.setItem('user_config', JSON.stringify(config));
  }



}
