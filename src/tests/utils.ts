import { expect } from 'chai';
import 'mocha';

import { Utils } from '../service/utils';

describe('Utilities', () => {
    describe('strings', () => {
        it('should expand camel case strings', () => {
            const expanded = Utils.string.expandCamelCase('camelCasePhrase');
            expect(expanded).to.equal('Camel Case Phrase');
        });

        it('should do case insensitive equals', () => {
            expect(Utils.string.iequals('test', 'TeSt')).to.be.true;
        });

        it('should not equate non-strings', () => {
            expect(Utils.string.iequals(null, 'TeSt')).to.be.false;
            expect(Utils.string.iequals('test', null)).to.be.false;
            expect(Utils.string.iequals(null, undefined)).to.be.false;
        })
    });
});
