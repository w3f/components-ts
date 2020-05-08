import { Logger } from '@w3f/logger';
import { Downloader } from '@w3f/downloader';
import fs from 'fs-extra';
import ospath from 'ospath';
import path from 'path';

import { Components, ComponentsMap } from './index';


export class ComponentsManager implements Components {
    constructor(
        private readonly componentsMap: ComponentsMap,
        private readonly donwloader: Downloader,
        private readonly logger: Logger
    ) { }

    async path(name: string): Promise<string> {
        if (!(name in this.componentsMap)) {
            throw new Error(`${name} not found in components config`);
        }
        const targetPath = path.join(ospath.data(), 'w3f', 'components', name);

        if (await fs.pathExists(targetPath)) {
            return targetPath;
        }
        const url = this.componentsMap[name];
        this.logger.info(`Downloading ${url}...`);

        await this.donwloader.getFile(url, targetPath);

        return targetPath;
    }
}
