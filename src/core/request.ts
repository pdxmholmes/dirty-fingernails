import * as Discord from 'discord.js';
import { Utils } from './utils';

export type RequestEmbed = {
  embed: Discord.RichEmbed
};

export class Requestor {
  readonly name: string;
  readonly id: string;
  readonly roles: string[];

  constructor(name: string, id: string, roles: string[]) {
    this.name = name;
    this.id = id;
    this.roles = roles;
  }

  hasRole(role: string): boolean {
    return this.roles && this.roles.some(r => Utils.iequals(r, role));
  }
}

export interface RequestData {
  [key: string]: any;
}

export interface IBotRequest {
  command: string;
  arguments: string[];
  requestor: Requestor;
  data: RequestData;
  reply(msg: string | RequestEmbed);
  replyDirect(msg: string | RequestEmbed);
}

export class BotRequest implements IBotRequest {
  readonly command: string;
  readonly arguments: string[];
  readonly requestor: Requestor;
  readonly data = {};
  private readonly original: Discord.Message;

  constructor(command: string, args: string[], original: Discord.Message) {
    this.command = command;
    this.arguments = args;
    this.requestor = new Requestor(
      original.member.displayName,
      original.member.id,
      original.member.roles.map(r => r.name)
    );
    this.original = original;
  }

  reply(response: string | RequestEmbed) {
    this.original.reply(response);
  }

  replyDirect(response: string | RequestEmbed) {
    this.original.member.send(response);
  }
}
