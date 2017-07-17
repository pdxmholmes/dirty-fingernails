import * as Discord from 'discord.js';
import { Bot, IBotRequest } from '../core';

export type CommandHandler = (request: IBotRequest, params: string[], args: any) => Promise<void>;

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
