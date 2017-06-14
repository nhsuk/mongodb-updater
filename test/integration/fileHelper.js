const chai = require('chai');

const fileHelper = require('../../lib/utils/fileHelper');

const expect = chai.expect;

describe('File Helper', () => {
  describe('loadJson', () => {
    it('should return empty array for missing file', () => {
      expect(fileHelper.loadJson('noSuchFile').length).to.equal(0);
    });
  });
});

