const chai = require('chai');

const fileHelper = require('../../lib/utils/fileHelper');

const expect = chai.expect;

describe('File Helper', () => {
  describe('get filename from URL', () => {
    it('should return last part of URL as filename', () => {
      expect(fileHelper.filenameFromUrl('http://site.net/file/pharmacy-data.json')).to.equal('pharmacy-data.json');
    });
  });
});
