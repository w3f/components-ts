import { Logger } from '@w3f/logger';
import { Downloader } from '@w3f/downloader';

import { Components, ComponentsConfig } from './index';


export class ComponentsManager implements Components {
    constructor(
        private readonly componentsConfig: ComponentsConfig,
        private readonly donwloader: Downloader,
        private readonly logger: Logger
    ) { }

    async path(name: string): Promise<string> {
        if (!(name in this.componentsConfig)) {
            throw new Error(`${name} not found in components config`);
        }
        const url = this.componentsConfig[name];

        return "";
    }
}
