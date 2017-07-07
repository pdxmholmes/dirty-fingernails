import * as path from 'path';
import * as Discord from 'discord.js';
import * as timestring from 'timestring';
import * as moment from 'moment';
import * as _ from 'lodash';

import { Bot } from '../../bot';
import { Group, IGroup } from '../../models';
import { Games } from '../../games';
import { ICommand } from '../command';
import { IBotRequest } from '../../request';

const info: ICommand = {
    match: 'info',
    handler: (request: IBotRequest, params: string[], args: string[]) => {
        const pkg = require('../../../package.json');
        const embed = new Discord.RichEmbed()
            .setTitle('Dirty Fingernails')
            .setDescription('A group management bot for United Operations')
            .addField('Contributors', pkg.contributors.join(', '))
            .addField('Version', pkg.version)
            .addField('Platform', `${process.platform} (${process.arch})`)
            .addField('Node', process.version)
            .addField('Environment', JSON.stringify(process.versions));

        request.replyDirect({ embed });
    }
};

export = info;
