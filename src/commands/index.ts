import * as Discord from 'discord.js';
import * as bunyan from 'bunyan';

import { BotContext } from '../context';
import { Flight, IFlight } from '../models';

const commands = {
	newflight: async (context: BotContext, msg: Discord.Message, args: string[]) => {
		if (args.length < 2) {
			return msg.reply('Usage: newflight <name> <startDate> [<campaign>]');
		}

		const name = args[0];
		const startTime = new Date(args[1]);

		try {
			await Flight.create({
				name: name,
				startTime: startTime,
				campaign: 'KTO',
				organizer: msg.member.displayName
			});

			msg.reply(`Added new flight ${name} starting at ${startTime.toUTCString()}`);
		}
		catch (err) {
			msg.reply('An error occurred adding the flight. Please contact an administrator.');
			// TODO: Log the error
		}
	},

	flights: (context: BotContext, msg: Discord.Message, args: string[]) => {
		if (context.flights.length < 1) {
			return msg.reply(`No flights currently scheduled`);
		}

		context.flights
			.forEach(f => {
				var embed = new Discord.RichEmbed();
				embed
					.setTitle(f.name)
					.setDescription(`Briefing at: ${f.startTime}`)
					.addField('Organizer', f.organizer);

				msg.channel.send({ embed: embed });
			});
	},

	help: (context: BotContext, msg: Discord.Message, args: string[]) => {
		msg.member.send('This is the help!');
	}
};

export default commands;
