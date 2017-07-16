import { expect } from 'chai';
import * as moment from 'moment';
import 'mocha';

import { ArgumentValidator } from '../../service/commands/validation';

describe('Commands', () => {
  const validator = new ArgumentValidator();

  describe('validation', () => {
    it('should correctly validate duration arguments', () => {
      const defs = [{
        name: 'testDuration',
        type: 'duration'
      }];

      const result = validator.validate(defs, ['1h 30m']);
      expect(result.valid).to.be.true;
      expect((result.values['testDuration'] as moment.Duration).asHours() === 1.5);
    });

    it('should reject invalid durations', () => {
      const defs = [{
        name: 'testDuration',
        type: 'duration'
      }];

      const result = validator.validate(defs, ['GobbldyGook']);
      expect(result.valid).to.be.false;
      expect(result.errors.length).to.equal(1);
    });

    it('should enforce minimum and maximum duration', () => {
      const defs = [{
        name: 'testDuration',
        type: 'duration',
        options: {
          min: 15,
          max: 60
        }
      }];

      const minResult = validator.validate(defs, ['10m']);
      expect(minResult.valid).to.be.false;
      expect(minResult.errors.length).to.equal(1);

      const maxResult = validator.validate(defs, ['65m']);
      expect(maxResult.valid).to.be.false;
      expect(maxResult.errors.length).to.equal(1);


    });

    it('should correctly validate number arguments', () => {
      const defs = [{
        name: 'testNumber',
        type: 'number'
      }];

      const result = validator.validate(defs, ['15']);
      expect(result.valid).to.be.true;
      expect(result.values['testNumber'] === 15);
    });

    it('should reject invalid numbers', () => {
      const defs = [{
        name: 'testNumber',
        type: 'number'
      }];

      const result = validator.validate(defs, ['ABCD']);
      expect(result.valid).to.be.false;
      expect(result.errors.length).to.equal(1);
    });

    it('should enforce number minimum and maximum', () => {
      const defs = [{
        name: 'testNumber',
        type: 'number',
        options: {
          min: 10,
          max: 20
        }
      }];

      const minResult = validator.validate(defs, ['5']);
      expect(minResult.valid).to.be.false;
      expect(minResult.errors.length).to.equal(1);

      const maxResult = validator.validate(defs, ['25']);
      expect(maxResult.valid).to.be.false;
      expect(maxResult.errors.length).to.equal(1);
    });

    it('should correctly validate string arguments', () => {
      const defs = [{
        name: 'testString',
        type: 'string'
      }];

      const result = validator.validate(defs, ['Hello World']);
      expect(result.valid).to.be.true;
      expect(result.values['testString'] === 'Hello World');
    });

    it('should correctly validate flag arguments', () => {
      const defs = [{
        name: 'testFlag',
        type: 'flag'
      }];

      const result = validator.validate(defs, ['testFlag']);
      expect(result.valid).to.be.true;
      expect(result.values['testFlag']).to.be.true;
    });

    it('should return usage as an error for missing arguments', () => {
      const defs = [{
        name: 'testString',
        type: 'string'
      }, {
        name: 'testNumber',
        type: 'number'
      }];

      const result = validator.validate(defs, []);
      expect(result.valid).to.be.false;
      expect(result.errors.length).to.equal(1);
      expect(result.errors[0].error).to.equal('<test string>, <test number>');
    });
  });
});
