import {SendTemplate} from "./sendTemplate";

export class MessageTemplate extends SendTemplate {

  message!: string;
  destination!: string;
  status?: number;

  constructor(message: string, destination: string, status?: number) {
    super();
    this.message = message;
    this.destination = destination;
    this.status = status;
  }


}
