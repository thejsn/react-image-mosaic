declare class ImageLoader {
    _loadCount: number;
    _completeCount: number;
    constructor();
    loadComplete(): void;
    get progress(): number;
    /**
     * Load an image.
     *
     * @param  {String} url Image url
     * @return {Promise}
     */
    load(url: string): Promise<HTMLImageElement>;
    /**
     *
     * @param urls
     * @param onProgress
     * @returns
     */
    loadAll(urls: string[], onProgress: {
        (progress: number): void;
    } | null): Promise<HTMLImageElement[]>;
    loadImage(url: string, onComplete?: {
        (): void;
    } | null, onProgress?: {
        (progress: number): void;
    } | null): Promise<HTMLImageElement>;
}
declare const _default: ImageLoader;
export default _default;
