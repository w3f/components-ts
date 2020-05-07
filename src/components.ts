import { Logger } from '@w3f/logger';
import { Components, ComponentsConfig } from './index';


export class ComponentsManager implements Components {
    constructor(private readonly componentsConfig: ComponentsConfig,
        private readonly logger: Logger) { }

    async path(name: string): Promise<string> {
        if (!(name in this.componentsConfig)) {
            throw new Error(`${name} not found in components config`);
        }
        return "";
    }
}
