declare module '@tryghost/content-api' {
    interface GhostContentAPIOptions {
        url: string;
        key: string;
        version: string;
    }

    interface BrowseParams {
        limit?: string | number;
        page?: number;
        order?: string;
        filter?: string;
        include?: string[];
    }

    interface ReadParams {
        id?: string;
        slug?: string;
    }

    interface Resource {
        browse(params?: BrowseParams): Promise<any[]>;
        read(params: ReadParams, options?: { include?: string[] }): Promise<any>;
    }

    class GhostContentAPI {
        constructor(options: GhostContentAPIOptions);
        posts: Resource;
        pages: Resource;
        authors: Resource;
        tags: Resource;
        settings: {
            browse(): Promise<any>;
        };
    }

    export default GhostContentAPI;
}
