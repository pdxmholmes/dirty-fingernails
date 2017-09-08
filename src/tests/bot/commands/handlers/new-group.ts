import { expect } from 'chai';
import * as moment from 'moment';
import 'mocha';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

import { ICommand } from '../../../../bot/commands';
import { IGroupModel } from '../../../../core/models';
import { Games } from '../../../../core/games';
import { IBotRequest, Requestor } from '../../../../core';

const sandbox = sinon.sandbox.create();
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

const traits = {
  needsGame: sandbox.stub().resolves(),
  needsGroup: sandbox.stub().resolves()
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

const mockRequest = {
  command: 'new-group',
  arguments: [
    '1h 30m',
    '10',
    'KTO',
    'Test mission'
  ],
  requestor: new Requestor('Joe', 'ABCDEFGHIJK123456789', ['Admin']),
  data: {
    gameType: 'bms',
    game: Games.Bms,
    groupId: 'ABC1',
    group: mockGroup,
  },
  reply: sandbox.stub(),
  replyDirect: sandbox.stub()
};

const mockArguments = {
  'timeUntilStart': moment.duration(3, 'hours'),
  'numberOfPlayers': 4,
  'campaign': 'KTO',
  'description': 'Test mission'
};

const newGroup = proxyquire<ICommand>('../../../../bot/commands/handlers/new-group', {
  '../../../core/models': models,
  '../../../core': core,
  '../traits': traits
});

describe('Command Handlers', () => {
  describe('new-group', () => {
    beforeEach(sandbox.reset);

    it('should create group with correct arguments', () => {
      newGroup.handler(mockRequest, ['flight'], mockArguments);
      expect(models.Group.create.called).to.be.true;
    });

    it('should notify requestor when group is created', () =>
      newGroup.handler(mockRequest, ['flight'], mockArguments)
        .then(() => expect(mockRequest.replyDirect.called).to.be.true));

    it('should log errors and tell the user something went wrong', () => {
      models.Group.create.rejects({ message: 'Something went wrong' });
      return newGroup.handler(mockRequest, ['flight'], mockArguments)
        .then(() => {
          expect(core.log.error.called).to.be.true;
          expect(mockRequest.replyDirect.called).to.be.true;
        });
    });
  });
});
