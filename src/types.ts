export interface ComponentsMap {
    [name: string]: string;
}

export interface ComponentsManager {
    path(componentName: string): Promise<string>;
}
