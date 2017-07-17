import * as Discord from 'discord.js';

export type RequestEmbed = {
  embed: Discord.RichEmbed
};

export interface IBotRequest {
  command: string;
  arguments: string[];
  requestor: string;
  requestorId: string;
  reply(msg: string | RequestEmbed);
  replyDirect(msg: string | RequestEmbed);
}

export class BotRequest implements IBotRequest {
  readonly command: string;
  readonly arguments: string[];
  readonly requestor: string;
  readonly requestorId: string;
  private readonly original: Discord.Message;

  constructor(command: string, args: string[], original: Discord.Message) {
    this.command = command;
    this.arguments = args;
    this.requestor = original.member.displayName;
    this.requestorId = original.member.id;
    this.original = original;
  }

  reply(response: string | RequestEmbed) {
    this.original.reply(response);
  }

  replyDirect(response: string | RequestEmbed) {
    this.original.member.send(response);
  }
}
