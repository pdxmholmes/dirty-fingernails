import * as Discord from 'discord.js';
import * as _ from 'lodash';
import * as nconf from 'nconf';
import * as mongoose from 'mongoose';
(mongoose as any).Promise = Promise;

import { Utils } from './utils';
import { CommandService } from '../commands';
import { Games } from '../games';
import { IBotRequest, BotRequest } from './request';
import { log } from './log';
import { Notifier } from './notifier';

export class Bot {
	readonly client: Discord.Client = new Discord.Client();
  private readonly commandService: CommandService = new CommandService();
  private readonly notifier: Notifier = new Notifier();

	constructor(options?: any) {
		// Options are fed in whole for unit testing
		if (options) {
			nconf.defaults(options);
		}
		else {
			nconf
				.defaults({
					bot: {
            commandPrefix: '!'
					}
				})
				.env()
				.file(`config.${this.getConfigEnvironment()}.json`);
		}
	}

	async run() {
		try {
			process.on('SIGINT', () => {
				log.info('Shutting down');

				this.client.destroy()
					.then(() => process.exit(0))
					.catch(() => process.exit(1));
			});

			await mongoose.connect(nconf.get('database:url'));

			this.client.on('ready', () => {
				log.info('Bot ready');
			});

			this.client.on('message', this.onMessage.bind(this));
			this.client.on('error', this.onError.bind(this));

			const token = nconf.get('discord:token');
			await this.client.login(token);
		}
		catch (err) {
			log.error(err);
			process.exit(1);
		}
	}

	private onMessage(message: Discord.Message) {
		const request = this.processRequest(message);
		if (!request) {
			return;
		}

		this.commandService.invoke(this, request);
	}

	private onError(err: Error) {
		log.error(err);
		process.exit(1);
	}

	private processRequest(message: Discord.Message): IBotRequest {
		if (message.author.bot ||
			!this.isChannelWhitelisted((message.channel as Discord.TextChannel).name)) {
			return null;
		}

		const commandPrefix = nconf.get('bot:commandPrefix');
		if (!message.content || !message.content.startsWith(commandPrefix)) {
			return null;
		}

		const input = message.content
			.substr(commandPrefix.length, message.content.length - commandPrefix.length).trim();

		const firstSpace = input.indexOf(' ');
		let cmd: string;
		let args = [];
		if (firstSpace === -1) {
			cmd = input;
		}
		else {
			cmd = input.substr(0, firstSpace);
			args = input.substr(firstSpace + 1).split(',').map(s => s.trim());
		}

		return new BotRequest(cmd, args, message);
	}

	private isChannelWhitelisted(channel: string): boolean {
    const whitelist = nconf.get('bot:channels:whitelist') as string[];
		if (!channel || !_.isArray(whitelist) || whitelist.length < 1) {
			return true;
		}

		return whitelist.some(c => Utils.iequals(c, channel));
	}

	private getConfigEnvironment(): string {
		switch (process.env.NODE_ENV) {
			case 'production':
				return '';

			default:
				return 'dev';
		}
	}
}
