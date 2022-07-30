export declare function updateSources(sources: string[], onProgress: {
    (progress: number): void;
}, onComplete: {
    (): void;
}): void;
/**
 * Add image to be used in the grid from URL.
 *
 * @param {String} url Path to image
 */
export declare function addSourceFromURL(onProgress: {
    (progress: number): void;
}, onComplete: {
    (): void;
}): (url: string) => Promise<void>;
