import ImageLoader from '../models/ImageLoader';
import Picture from '../models/Picture';

export async function createTargetPicture(
    target:HTMLImageElement | string,
    columns:number,
    rows:number,
    pixelAspectRatio:number
) {

    if(typeof target === 'string') {
        // Assume it's a url..
        const image = await loadTargetImage(target);
        return createPicture(image, columns, rows, pixelAspectRatio);

    } else if(typeof target === 'object' && target.src) {
        // Assume it's an Image...
        return createPicture(target, columns, rows, pixelAspectRatio);
    }

    throw new Error('Could not create target image.');
}

/**
 * Set the target image from URL.
 */
async function loadTargetImage(url:string) {
    return await ImageLoader.load(url);
}

/**
 * Set the image to be built directly.
 */
function createPicture(
    image:HTMLImageElement,
    columns:number,
    rows:number,
    pixelAspectRatio:number
) {
    return new Picture(
        image,
        columns,
        rows,
        pixelAspectRatio
    );
}
