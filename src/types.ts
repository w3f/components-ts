export interface ComponentsMap {
    [name: string]: string;
}

export interface Components {
    path(componentName: string): Promise<string>;
}
