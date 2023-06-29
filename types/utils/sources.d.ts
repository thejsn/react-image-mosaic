export declare function updateSources(sources: string[], onProgress: {
    (progress: number): void;
}, onComplete: {
    (): void;
}): void;
/**
 * Remove image from the grid by URL.
 *
 * @param {String} url Path or link to image
 */
export declare function removeSourcesByURL(sources: string[]): void;
/**
 * Add image to be used in the grid from URL.
 *
 * @param {String} url Path to image
 */
export declare function addSourcesFromURL(urls: string[], onProgress: {
    (progress: number): void;
}, onComplete: {
    (): void;
}): Promise<void>;
