import { expect } from 'chai';
import 'mocha';
import * as _ from 'lodash';

import { Utils, ID_LENGTH, POSSIBLE_ID_CHARACTERS } from '../../core';

describe('Utilities', () => {
  it(`should generate correct length id with correct characters`, () => {
    const id = Utils.newId();
    expect(id.length).to.equal(ID_LENGTH);
    expect(id.split('').every(c => POSSIBLE_ID_CHARACTERS.indexOf(c) !== -1)).to.be.true;
  });

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
    expect(Utils.iequals('123', (123 as any)));
  });
});
