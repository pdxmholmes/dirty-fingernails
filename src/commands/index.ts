import * as Discord from 'discord.js';
import { BotContext } from '../context';

const commands = {
    'newflight': function (context: BotContext, msg: Discord.Message, args: string[]) {
        if (args.length < 2) {
            return msg.reply('Usage: newflight <name> <startDate> [<campaign>]')
        }

        const name = args[0];
        const startTime = new Date(args[1]);

        context.newFlight(name, startTime);
        msg.reply(`Added new flight ${name} starting at ${startTime.toUTCString()}`);
    },

    'flights': function (context: BotContext, msg: Discord.Message, args: string[]) {
        if (context.flights.length < 1) {
            return msg.reply(`No flights currently scheduled`);
        }

        const flights = context.flights
            .map(f => `${f.name} (${f.startTime.toUTCString()})`)
            .join(', ');

        msg.reply(`Currently scheduled flights: ${flights}`);
    },

    'help': function (context: BotContext, msg: Discord.Message, args: string[]) {
        msg.member.send('This is the help!');
    }
}

export default commands;
