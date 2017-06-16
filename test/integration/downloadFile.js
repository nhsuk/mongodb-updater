const chai = require('chai');
const fs = require('fs');
const nock = require('nock');

const downloadFile = require('../../lib/downloadFile');
const fileHelper = require('../../lib/utils/fileHelper');
const config = require('../../config/config');

const expect = chai.expect;

const filename = 'test.json';
const filePath = `${config.INPUT_DIR}/${filename}`;
const url = 'http://somesite/test.json';

describe('Download ETL files', () => {
  it('should download ETL file to input folder', (done) => {
    nock(url)
      .get('')
      .reply(200, '[ {"id": 1} ]');
    downloadFile(url, 'test.json')
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(filePath)).to.be.true;
        done();
      }).catch(done);
  });

  it('should not replace existing json file if the new json is invalid', (done) => {
    nock(url)
      .get('')
      .reply(200, 'bad json');

    downloadFile(url, filename)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(filePath)).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(fileHelper.loadJson(filePath)).to.exist;
        done();
      }).catch(done);
  });

  it('should not replace existing json file if the new json has much fewer records', (done) => {
    nock(url)
      .get('')
      .reply(200, '[]');

    downloadFile(url, filename)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(filePath)).to.be.true;
        const json = fileHelper.loadJson(filePath);
        // eslint-disable-next-line no-unused-expressions
        expect(json).to.exist;
        expect(json.length).to.be.greaterThan(0);
        done();
      }).catch(done);
  });

  it('should not replace existing json file if the url invalid', (done) => {
    nock(url)
      .get('')
      .replyWithError('download throws error');

    downloadFile(url, filename)
      .then(() => {
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(filePath)).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(fileHelper.loadJson(filePath)).to.exist;
        done();
      }).catch(done);
  });
});

