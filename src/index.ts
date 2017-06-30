import * as Discord from 'discord.js';
import * as _ from 'lodash';
import * as bunyan from 'bunyan';
import * as nconf from 'nconf';

import { default as commands } from './commands';
import { BotContext } from './context';

function getConfigEnvironment() {
    switch (process.env.NODE_ENV) {
        case "production":
            return "";

        default:
            return "dev";
    }
}

const log = bunyan.createLogger({ name: 'dirty-fingernails' });
nconf
    .defaults({
        bot: {
            commandPrefix: '!!'
        }
    })
    .env().file(`config.${getConfigEnvironment()}.json`);

const client = new Discord.Client();
const token = nconf.get('discord:token');
const commandPrefix = nconf.get('bot:commandPrefix');
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
