export interface ComponentMap {
    name: string;
    url: string;
}

export type ComponentMapList = Array<ComponentMap>;

export interface Components {
    path(componentName: string): Promise<string>;
}

export interface ComponentsConfig {
    components: ComponentMapList;
}
