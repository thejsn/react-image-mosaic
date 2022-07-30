declare class ImageLoader {
    _loadCount: number;
    _completeCount: number;
    loadComplete(): void;
    get progress(): number;
    /**
     * Load an image.
     *
     * @param  {String} url Image url
     * @return {Promise}
     */
    load(url: string): Promise<HTMLImageElement>;
}
declare const _default: ImageLoader;
export default _default;
