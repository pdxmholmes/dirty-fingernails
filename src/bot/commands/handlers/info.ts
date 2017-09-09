import * as Discord from 'discord.js';

import { IBotRequest } from '../../../core';
import { Games } from '../../../core/games';
import { ICommand } from '../command';

const info: ICommand = {
  id: 'info',
  match: 'info',
  handler: async (request: IBotRequest, params: string[], args: string[]) => {
    const pkg = require('../../../../package.json');
    const embed = new Discord.RichEmbed()
      .setTitle('Dirty Fingernails')
      .setDescription('A group management bot for United Operations')
      .addField('Contributors', pkg.contributors.join(', '))
      .addField('Version', pkg.version)
      .addField('Platform', `${process.platform} (${process.arch})`)
      .addField('Node', process.version)
      .addField('Environment', JSON.stringify(process.versions))
      .addField('Supported Games', Games.all.map(g => g.name).join(', '));

    request.replyDirect({ embed });
  }
};

export = info;
