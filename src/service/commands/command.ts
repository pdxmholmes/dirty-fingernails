import * as Discord from 'discord.js';
import { Bot, IBotRequest } from '../core';

export interface CommandHandler {
	(request: IBotRequest, params: string[], args: any);
}

export interface ICommandArgument {
	name: string;
  type: string;
  optional?: boolean;
	options?: any;
}

export interface ICommand {
	match: RegExp | string;
	handler: CommandHandler;
	arguments?: ICommandArgument[];
}
