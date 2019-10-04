import { ELgxUrlAction } from "../enums/lgx-url-actions";

export class LgxUrl {
  private url: string;
  private action: ELgxUrlAction | null;
  constructor(url: string, action?: ELgxUrlAction) {
    this.url = url;
    this.action = action ? action : null;
  }

  getUrl(): string {
    return this.url;
  }

  getAction(): ELgxUrlAction | null {
    return this.action;
  }
}
