import Grid from '../models/Grid';
import ImageLoader from'../models/ImageLoader';

let currentSources: string[] = [];

export function updateSources(
    sources: string[],
    onProgress: { (progress:number):void },
    onComplete: { ():void }
) {

    const toAdd = sources.filter(source => currentSources.indexOf(source) === -1);

    const toRemove = currentSources.filter(current=>sources.indexOf(current)===-1);

    currentSources = sources;

    addSourcesFromURL(toAdd, onProgress, onComplete);
    removeSourcesByURL(toRemove);
}

/**
 * Remove image from the grid by URL.
 *
 * @param {String} url Path or link to image
 */
export function removeSourcesByURL(sources: string[]) {

    // Creates absolute urls (if source is a relative path) to test against picture.image.src
    const urls = sources.map(path => {
        const a = document.createElement('a');
        a.href = path;
        return a.href;
    });

    urls.forEach(img => {
        Grid.removeSourceImage(img);
     });

}

/**
 * Add image to be used in the grid from URL.
 *
 * @param {String} url Path to image
 */
export function addSourcesFromURL(
    urls: string[],
    onProgress: { (progress:number):void },
    onComplete: { ():void }
) {
    return ImageLoader.loadAll(urls, onProgress)
        .then((images: HTMLImageElement[]) => {

            images.forEach(img => {
                Grid.addSourceImage(img);
            });

            onComplete();
        })
}
