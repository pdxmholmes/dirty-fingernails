import * as Discord from 'discord.js';
import * as _ from 'lodash';
import * as bunyan from 'bunyan';
import * as nconf from 'nconf';
import * as mongoose from 'mongoose';
(<any>mongoose).Promise = Promise;


import { default as commands } from './commands';
import { BotContext } from './context';

export class Bot {
	constructor() {
		this.log = bunyan.createLogger({ name: 'dirty-fingernails' });
		this.client = new Discord.Client();
		this.context = new BotContext();
	}

	async run() {
		try {
			process.on('SIGINT', () => {
				this.log.info('Shutting down');

				this.client.destroy()
					.then(() => process.exit(0))
					.catch(() => process.exit(1));
			});

			nconf
				.defaults({
					bot: {
						commandPrefix: '!!'
					}
				})
				.env()
				.file(`config.${this.getConfigEnvironment()}.json`);

			await mongoose.connect(nconf.get('database:url'));

			this.client.on('ready', () => {
				this.log.info('Bot ready');
			});

			this.client.on('message', this.onMessage.bind(this));
			this.client.on('error', this.onError.bind(this));

			const token = nconf.get('discord:token');
			await this.client.login(token);
		}
		catch (err) {
			this.log.error(err);
			process.exit(1);
		}
	}

	private onMessage(msg: Discord.Message) {
		if (msg.author.bot || msg.channel.type === 'dm') {
			return;
		}

		const commandPrefix = nconf.get('bot:commandPrefix');
		if (!msg.content || !msg.content.startsWith(commandPrefix)) {
			return;
		}

		const input = msg.content.substr(commandPrefix.length, msg.content.length - commandPrefix.length).trim();
		const cmd = input.split(' ')[0];
		const args = input.split(' ').slice(1);

		if (commands[cmd]) {
			this.log.info({
				invoker: msg.member.displayName,
				invokerId: msg.member.id,
				command: cmd
			}, `Invoking ${cmd}`);

			commands[cmd](this.context, msg, args);
		}
	}

	private onError(err: Error) {
		this.log.error(err);
		process.exit(1);
	}

	private getConfigEnvironment(): string {
		switch (process.env.NODE_ENV) {
			case 'production':
				return '';

			default:
				return 'dev';
		}
	}

	readonly log: bunyan;
	readonly client: Discord.Client;
	readonly context: BotContext;
}
