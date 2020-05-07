import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { createLogger } from '@w3f/logger';

import { ComponentsManager } from '../src/index';

chai.use(chaiAsPromised);
chai.should();

const logger = createLogger();
const cfg = {
    components: [
        {
            name: 'some_component',
            url: 'some_url'
        }
    ]
}
const subject = new ComponentsManager(cfg, logger);


describe('ComponentManager', () => {
    describe('path', () => {
        it('should throw if an unknown component is requested', () => {
            subject.path('unknown').should.be.rejected;
        });
    });
});
