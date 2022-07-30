import Grid from '../models/Grid';
import ImageLoader from'../models/ImageLoader';

let currentSources: string[] = [];

export function updateSources(
    sources: string[],
    onProgress: { (progress:number):void },
    onComplete: { ():void }) {

    const toAdd = sources.filter(source => currentSources.indexOf(source) === -1);

    // TODO: Implement support in Grid...
    // const toRemove = currentSources.filter(
    //     source => sources.indexOf(source) === -1
    // );

    currentSources = sources;

    toAdd.forEach(addSourceFromURL(onProgress, onComplete));
}

/**
 * Add image to be used in the grid from URL.
 * 
 * @param {String} url Path to image
 */
export function addSourceFromURL(
    onProgress: { (progress:number):void },
    onComplete: { ():void }
) {
    return (url: string) => {
        return ImageLoader.load(url)
            .then((image: HTMLImageElement) => {
                Grid.addSourceImage(image);
            })
            .catch((error: string) => {
                console.warn('[mosaic.js] Error loading ' + url + ' - ', error);
            })
            .then(() => {

                if(onProgress) {
                    onProgress(ImageLoader.progress);
                }

                if (onComplete && ImageLoader.progress == 1) {
                    onComplete();
                }
            });
    }
}
