export class ChatTemplate{

  name!: string;
  message!: string;
  date!: string;
  time!: string;


  constructor(name: string, message: string, date: string, time: string) {
    this.name = name;
    this.message = message;
    this.date = date;
    this.time = time;
  }
}
