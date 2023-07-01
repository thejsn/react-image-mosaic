
export default class Picture {

    _aspectRatio = 1;
    _averageColor = 0;
    _width = 0;
    _height = 0;
    _image: HTMLImageElement | null = null;
    _canvas: HTMLCanvasElement | null = null;
    _context: CanvasRenderingContext2D | null = null;

    /**
	 * Creates an instance of Picture.
	 *
	 * @param {any} image
	 * @param {number} [width=10]
	 * @param {number} [height=10]
	 * @param {number} [aspectRatio=1]
	 *
	 * @memberOf Picture
	 */
    constructor(image: HTMLImageElement, width = 10, height = 10, aspectRatio = 1) {

        const hasDoc = typeof document !== 'undefined';

        // No SSR :(
        if(!hasDoc) { return; }

        // eslint-disable-next-line no-undef
        this._canvas = hasDoc && document.createElement('canvas');
        this._context = this._canvas.getContext('2d');

        //---------------------------------------
        // Setup
        //---------------------------------------

        this.setSize(width, height, aspectRatio);

        if (image) {
            this.setImage(image);
        }
    }

    //---------------------------------------
    // Private
    //---------------------------------------

    /**
	 * Get image dimensions based on source image
	 * and dimensions of grid square.
	 *
	 * @return {Object} Object with size data.
	 */
    _getBounds(image: HTMLImageElement) {

        const imgWidth = image.naturalWidth,
            imgHeight = image.naturalHeight;

        // Default sizes and positions
        let sx = 0,
            sy = 0,
            sw = imgWidth,
            sh = imgHeight;

        const dx = 0,
            dy = 0,
            dw = this._width,
            dh = this._height,
            pr = this._aspectRatio;

        // Relation between width and height for source and destination.
        // Adjust ratio with aspectRatio.
        const sr = sw / sh,
            dr = (dw * pr) / dh;

        // Differance in relation determines wich is wider/taller.
        if (sr > dr) {
            // Taller image
            sw = sh * dr;
            sx = (imgWidth * 0.5) - (sw * 0.5);
        } else {
            // Wider image
            sh = sw / dr;
            sy = (imgHeight * 0.5) - (sh * 0.5);
        }

        return {
            sx, sy,
            sw, sh,
            dx, dy,
            dw, dh
        }
    }

    /**
	 * Draws image to virtual canvas which is used to retrieve pixels.
	 *
	 * @returns
	 *
	 * @memberOf Picture
	 */
    _drawImage() {

        if (!(
            this._width > 0 &&
            this._height > 0 &&
            this._image &&
            this._context
        )) {
            return;
        }

        const b = this._getBounds(this._image);

        this._context.drawImage(
            this._image,
            b.sx, b.sy, b.sw, b.sh,
            b.dx, b.dy, b.dw, b.dh
        );

        this._averageColor = this._calculateAverageColor(this.getImageData());
    }

    /**
	 * Loops through all colors, adds all channels together
	 * then returns it as a color value.
	 *
	 * @returns {number} The color.
	 *
	 * @memberOf Picture
	 */
    _calculateAverageColor(pixels: Uint8ClampedArray | undefined) {

        if(!pixels) {
            return 0;
        }

        const len	= pixels.length / 4;

        let red	= 0;
        let green = 0;
        let blue = 0;

        for (let i = 0; i < len*4; i+=4) {
            red 	+= pixels[i];
            green 	+= pixels[i+1];
            blue 	+= pixels[i+2];
        }

        red 	/= len;
        green 	/= len;
        blue 	/= len;

        return red << 16 | green << 8 | blue;
    }

    //---------------------------------------
    // Getters / setters
    //---------------------------------------

    get width() {
        return this._image?.naturalWidth || 0;
    }

    get height() {
        return this._image?.naturalHeight || 0;
    }

    get canvas(): HTMLCanvasElement | null {
        return this._canvas;
    }

    get context() {
        return this._context;
    }

    get averageColor(): number {
        return this._averageColor;
    }

    get image() {
        return this._image;
    }

    get src() {
        return this._image?.src || null
    }

    //---------------------------------------
    // Public methods
    //---------------------------------------

    /**
	 * This will redraw the image. Avoid this in loops/raf.
	 *
	 * @param {Number} width  New width.
	 * @param {Number} height New height.
	 */
    setSize(width = 0, height = 0, aspectRatio = 1) {

        this._aspectRatio = aspectRatio;
        this._width = Number(width);
        this._height = Number(height);

        if(this._canvas) {
            this._canvas.width = this._width;
            this._canvas.height = this._height;
        }

        // ------------------------

        this._drawImage();
    }

    /**
	 * Returns an array of pixeldata.
	 *
	 * @returns {Uint8ClampedArray}
	 *
	 * @memberOf Picture
	 */
    getImageData() {
        return this._context?.getImageData(0, 0, this._width, this._height)?.data;
    }

    /**
	 * Set image to do analysis on. Image source must be loaded.
	 *
	 * @param {Image} image
	 *
	 * @memberOf Picture
	 */
    setImage(image: HTMLImageElement) {
        this._image = image;
        this._drawImage();
    }
}
