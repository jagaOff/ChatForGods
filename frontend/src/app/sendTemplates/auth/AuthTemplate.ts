import {SendTemplate} from "../sendTemplate";

export class AuthTemplate extends SendTemplate {
  username!: string;
  password!: string;


  constructor(username: string, password: string) {
    super();
    this.username = username;
    this.password = password;
  }
}
