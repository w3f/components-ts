import { Logger } from '@w3f/logger';
import { Downloader, DownloadManager } from '@w3f/downloader';
import fs from 'fs-extra';
import ospath from 'ospath';
import path from 'path';

import { Components, ComponentsMap } from './index';


export class ComponentsManager implements Components {
    private downloader: Downloader;

    constructor(
        private readonly componentsMap: ComponentsMap,
        private readonly logger: Logger
    ) {
        this.downloader = new DownloadManager(logger);
    }

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

        await this.downloader.getFile(url, targetPath);

        return targetPath;
    }
}
