import {SendTemplate} from "./sendTemplate";

export class ChatTemplate extends SendTemplate{

  name!: string;
  message!: string;
  date!: string;
  time!: string;


  constructor(name: string, message: string, date: string, time: string) {
    super()
    this.name = name;
    this.message = message;
    this.date = date;
    this.time = time;
  }
}
