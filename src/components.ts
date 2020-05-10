import { Logger } from '@w3f/logger';
import { Downloader, DownloadManager } from '@w3f/downloader';
import fs from 'fs-extra';
import ospath from 'ospath';
import path from 'path';
import tar from 'tar';


import { Components, ComponentsMap } from './index';

const zipExtension = 'tar.gz';

export class ComponentsManager implements Components {
    private downloader: Downloader;

    constructor(
        private readonly appName: string,
        private readonly componentsMap: ComponentsMap,
        private readonly logger: Logger
    ) {
        this.downloader = new DownloadManager(logger);
    }

    async path(name: string): Promise<string> {
        if (!(name in this.componentsMap)) {
            throw new Error(`${name} not found in components config`);
        }
        const targetPath = path.join(this.basePath(), name);

        if (await fs.pathExists(targetPath)) {
            return targetPath;
        }

        const url = this.componentsMap[name];

        let destination = targetPath;
        if (this.isTarball(url)) {
            destination = path.join(this.basePath(), path.basename(url));
        }

        this.logger.info(`Downloading ${url}...`);
        await this.downloader.getFile(url, destination);

        if (this.isTarball(url)) {
            this.logger.info('Unpacking tarball...');
            await tar.extract({ file: destination, cwd: path.dirname(destination) });
        }

        await fs.chmod(targetPath, "0700");

        return targetPath;
    }

    public basePath(): string {
        return path.join(ospath.data(), this.appName, 'components');
    }

    private isTarball(url: string): boolean {
        return url.substr(-6) === zipExtension;
    }
}
