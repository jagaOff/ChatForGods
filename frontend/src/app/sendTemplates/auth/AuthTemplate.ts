import {SendTemplate} from "../sendTemplate";

export class AuthTemplate extends SendTemplate {
  username!: string;
  password!: string;
  token!: string;


  constructor(username: string, password: string, token: string) {
    super();
    this.username = username;
    this.password = password;
    this.token = token;
  }
}
