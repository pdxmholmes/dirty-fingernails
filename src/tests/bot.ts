import { expect } from 'chai';
import 'mocha';

import { Bot } from '../service/bot';
import { IBotRequest } from '../service/request';

function createMockMessage(content: string) {
  return {
    author: {
      bot: false
    },
    content,
    channel: {
      name: 'test'
    },
    member: {
      displayName: 'TestUser',
      id: '123456789'
    }
  };
}

describe('Bot', () => {
  const bot = new Bot({
    bot: {
      commandPrefix: '!',
      channels: {
        whitelist: [
          'test'
        ]
      }
    }
  });

  it('should parse commands correctly', () => {
    const message = createMockMessage('!this is a request, with, four, args');
    const request = (bot as any).processRequest(message) as IBotRequest;

    expect(request).to.be.not.null;
    expect(request.command).to.equal('this');
    expect(request.arguments.length).to.equal(4);
  });

  it('should ignore requests without command prefix', () => {
    const message = createMockMessage('##this is not, a, request');
    const request = (bot as any).processRequest(message) as IBotRequest;

    expect(request).to.be.null;
  });

  it('should ignore requests from bots', () => {
    const message = createMockMessage('!correct request, from bot');
    message.author.bot = true;

    const request = (bot as any).processRequest(message) as IBotRequest;
    expect(request).to.be.null;
  });

  it('should ignore channels that are not whitelisted', () => {
    const message = createMockMessage('!message on, bad, channel');
    message.channel.name = 'test2';

    const request = (bot as any).processRequest(message) as IBotRequest;
    expect(request).to.be.null;
  });

  it('should treat empty whitelist as wildcard whitelist', () => {
    const bot = new Bot({
      bot: {
        commandPrefix: '!',
        channels: {
          whitelist: []
        }
      }
    });

    const message = createMockMessage('!message on, bad, channel');
    message.channel.name = 'test2';

    const request = (bot as any).processRequest(message) as IBotRequest;
    expect(request).to.be.not.null;
  });
});
