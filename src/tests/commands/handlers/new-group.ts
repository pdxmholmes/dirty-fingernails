import { expect } from 'chai';
import * as moment from 'moment';
import 'mocha';
import * as sandbox from 'sinon';
import * as proxyquire from 'proxyquire';

import { ICommand } from '../../../service/commands';
import { IGroupModel } from '../../../service/models';
import { IBotRequest, Requestor } from '../../../service/core';

const core = {
  log: {
    info: sandbox.stub(),
    error: sandbox.stub(),
    warn: sandbox.stub(),
    debug: sandbox.stub()
  }
};

const models = {
  Group: {
    create: sandbox.stub()
  }
};

const mockRequest = {
  command: 'new-group',
  arguments: [
    '1h 30m',
    '10',
    'KTO',
    'Test mission'
  ],
  requestor: new Requestor('Joe', 'ABCDEFGHIJK123456789', ['Admin']),
  reply: sandbox.stub(),
  replyDirect: sandbox.stub()
};

const mockArguments = {
  'timeUntilStart': moment.duration(3, 'hours'),
  'numberOfPlayers': 4,
  'campaign': 'KTO',
  'description': 'Test mission'
};

const mockGroup = {
  name: 'Test Group',
  groupId: 'ABC1',
  gameId: 'bms',
  startTime: moment().toDate(),
  organizer: 'Joe',
  organizerId: 'ABCDEFGHIJK123456789',
  numberOfPlayers: 4,
  attributes: [
    { name: 'campaign', value: 'KTO' }
  ],
  fullId: sandbox.stub().returns('ABC1'),
  reservationCount: sandbox.stub().returns(1)
};

const newGroup = proxyquire<ICommand>('../../../service/commands/handlers/new-group', {
  '../../models': models,
  '../../core': core
});

describe('Command Handlers', () => {
  describe('new-group', () => {
    beforeEach(() => {
      models.Group.create.resetHistory();
      models.Group.create.resolves(mockGroup);
      mockRequest.reply.resetHistory();
      mockRequest.replyDirect.resetHistory();
      core.log.info.resetHistory();
      core.log.error.resetHistory();
      core.log.warn.resetHistory();
      core.log.debug.resetHistory();
    });

    it('should create group with correct arguments', () => {
      newGroup.handler(mockRequest, ['flight'], mockArguments);
      expect(models.Group.create.called).to.be.true;
    });

    it('should notify requestor when group is created', () => {
      return newGroup.handler(mockRequest, ['flight'], mockArguments)
        .then(() => expect(mockRequest.replyDirect.called).to.be.true);
    });

    it('should log errors and tell the user something went wrong', () => {
      models.Group.create.rejects({ message: 'Something went wrong' });
      return newGroup.handler(mockRequest, ['flight'], mockArguments)
        .then(() => {
          expect(core.log.error.called).to.be.true;
          expect(mockRequest.replyDirect.called).to.be.true;
        });
    });

    it('should warn when unknown game type provided', () => {
      return newGroup.handler(mockRequest, ['foo'], mockArguments)
        .then(() => expect(core.log.warn.called).to.be.true);
    });
  });
});
