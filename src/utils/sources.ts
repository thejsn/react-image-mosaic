import Grid from '../models/Grid';
import ImageLoader from'../models/ImageLoader';

let currentSources: string[] = [];

export function updateSources(
    sources: string[],
    onProgress: { (progress:number):void },
    onComplete: { ():void }
) {

    const toAdd = sources.filter(source => currentSources.indexOf(source) === -1);

    // TODO: Implement support in Grid...
    // const toRemove = currentSources.filter(
    //     source => sources.indexOf(source) === -1
    // );

    currentSources = sources;

    addSourcesFromURL(toAdd, onProgress, onComplete);
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
