import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs-extra';
import ospath from 'ospath';
import path from 'path';
import sinon from 'sinon';
import tmp from 'tmp';
import { createLogger } from '@w3f/logger';
import { Cmd } from '@w3f/cmd';

import { ComponentsManager } from '../src/index';

chai.use(chaiAsPromised);
chai.should();

const logger = createLogger();
const cmd = new Cmd(logger, { verbose: true });
const cfg = {
    'hello-world.sh': 'https://w3f.github.io/components-ts/test/hello-world.sh',
    'non-existent.txt': 'http://non.existent.com/non-existent.txt',
    'hello-world-tar-gz.sh': 'https://w3f.github.io/components-ts/test/hello-world.sh.tar.gz',
};
const subject = new ComponentsManager(cfg, logger);
let sandbox;
let dataPath: string;

describe('ComponentManager', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();

        const tmpobj = tmp.dirSync();
        dataPath = tmpobj.name;
        const st = sandbox.stub(ospath, 'data');
        st.returns(dataPath);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('path', () => {
        it('should throw if an unknown component is requested', () => {
            subject.path('unknown').should.be.rejected;
        });

        it('should download the component the first time called', async () => {
            const filename = 'hello-world.sh';

            const expectedPath = path.join(dataPath, 'w3f', 'components', filename);

            fs.pathExists(expectedPath).should.eventually.be.false;

            const actualPath = await subject.path(filename);
            actualPath.should.eq(expectedPath);

            fs.pathExists(expectedPath).should.eventually.be.true;

            const expectedOutput = 'Hello World!';
            const actualOutput = await cmd.exec(expectedPath);
            actualOutput.should.eq(expectedOutput);
        });

        it('should throw if it cant download the component', () => {
            subject.path('non-existent.txt').should.be.rejected;
        });

        it('should handle tar.gz archives', async () => {
            const filename = 'hello-world-tar-gz.sh';

            const expectedPath = path.join(dataPath, 'w3f', 'components', filename);

            fs.pathExists(expectedPath).should.eventually.be.false;

            const actualPath = await subject.path(filename);
            actualPath.should.eq(expectedPath);

            fs.pathExists(expectedPath).should.eventually.be.true;

            const expectedOutput = 'Hello World!';
            const actualOutput = await cmd.exec(expectedPath);
            actualOutput.should.eq(expectedOutput);
        });
    });
    describe('basePath', () => {
        it('should return a path dependent on ospath', () => {
            const expectedPath = path.join(dataPath, 'w3f', 'components');

            const actualPath = subject.basePath();

            actualPath.should.eq(expectedPath);
        })
    });
});
