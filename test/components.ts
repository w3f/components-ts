import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs-extra';
import ospath from 'ospath';
import path from 'path';
import sinon from 'sinon';
import tmp from 'tmp';
import { createLogger } from '@w3f/logger';
import { DownloadManager } from '@w3f/downloader';


import { ComponentsManager } from '../src/index';

chai.use(chaiAsPromised);
chai.should();

const logger = createLogger();
const downloader = new DownloadManager();
const cfg = {
    'hello-world.sh': 'https://w3f.github.io/components-ts/test/hello-world.sh',
    'non-existent.txt': 'http://non.existent.com/non-existent.txt'
};
const subject = new ComponentsManager(cfg, downloader, logger);
let sandbox;

describe('ComponentManager', () => {
    describe('path', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should throw if an unknown component is requested', () => {
            subject.path('unknown').should.be.rejected;
        });

        it('should download the component the first time called', async () => {
            const tmpobj = tmp.dirSync();
            const dataPath = tmpobj.name;
            const st = sandbox.stub(ospath, 'data');
            st.returns(dataPath);

            const filename = 'hello-world.sh';

            const expectedPath = path.join(dataPath, 'w3f', 'components', filename);

            fs.pathExists(expectedPath).should.eventually.be.false;

            await subject.path(filename);

            fs.pathExists(expectedPath).should.eventually.be.true;
        });
        it('should throw if it cant download the component', async () => {
            const tmpobj = tmp.dirSync();
            const dataPath = tmpobj.name;
            const st = sandbox.stub(ospath, 'data');
            st.returns(dataPath);

            subject.path('non-existent.txt').should.eventually.throw();
        });
    });
});
