import * as Discord from 'discord.js';
import * as _ from 'lodash';
import * as bunyan from 'bunyan';
import { default as commands } from './commands';
import { BotContext } from './context';

const log = bunyan.createLogger({ name: 'dirty-fingernails' });

const client = new Discord.Client();
const token = 'MzMwMjA5ODY4MzY1NTYxODU3.DDdtnw.jNNl80B3FFLcBFNZvAWn8FEkAAA';
const commandPrefix = '!!';
const context = new BotContext();

client.on('ready', () => {
    log.info('Bot ready');
});

client.on('error', err => {
    log.error(err);
    process.exit(1);
});

client.on('message', msg => {
    if (msg.author.bot) {
        return;
    }

    if (!msg.content || !msg.content.startsWith(commandPrefix)) {
        return;
    }

    const input = msg.content.substr(commandPrefix.length, msg.content.length - commandPrefix.length).trim();
    const cmd = input.split(' ')[0];
    const args = input.split(' ').slice(1);

    if (commands[cmd]) {
        log.info({
            invoker: msg.member.displayName,
            invokerId: msg.member.id,
            command: cmd
        }, `Invoking ${cmd}`);

        commands[cmd](context, msg, args);
    }
});

process.on('SIGINT', () => {
    log.info('Shutting down');

    client.destroy()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
});

client.login(token);
