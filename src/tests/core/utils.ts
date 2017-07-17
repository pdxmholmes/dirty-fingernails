import { expect } from 'chai';
import 'mocha';

import { Utils } from '../../service/core';

describe('Utilities', () => {
  describe('strings', () => {
    it('should expand camel case strings', () => {
      const expanded = Utils.expandCamelCase('camelCasePhrase');
      expect(expanded).to.equal('Camel Case Phrase');
    });

    it('should do case insensitive equals', () => {
      expect(Utils.iequals('test', 'TeSt')).to.be.true;
    });

    it('should not equate non-strings', () => {
      expect(Utils.iequals(null, 'TeSt')).to.be.false;
      expect(Utils.iequals('test', null)).to.be.false;
      expect(Utils.iequals(null, undefined)).to.be.false;
    });
  });
});
