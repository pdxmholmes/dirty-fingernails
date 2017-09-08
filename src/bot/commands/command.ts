import * as Discord from 'discord.js';
import { IBotRequest } from '../../core';
import { CommandTrait } from './traits';

export type CommandCanExecute = (requestor: IBotRequest, params: string[], args: any) => boolean;
export type CommandHandler = (request: IBotRequest, params: string[], args: any) => Promise<void>;

export interface ICommandArgument {
  name: string;
  type: string;
  optional?: boolean;
  options?: any;
}

export interface ICommand {
  id: string;
  match: RegExp | string;
  handler: CommandHandler;
  traits?: CommandTrait[];
  canExecute?: CommandCanExecute;
  arguments?: ICommandArgument[];
}
