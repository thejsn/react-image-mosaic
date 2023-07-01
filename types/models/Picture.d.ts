export default class Picture {
    _aspectRatio: number;
    _averageColor: number;
    _width: number;
    _height: number;
    _image: HTMLImageElement | null;
    _canvas: HTMLCanvasElement | null;
    _context: CanvasRenderingContext2D | null;
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
    constructor(image: HTMLImageElement, width?: number, height?: number, aspectRatio?: number);
    /**
     * Get image dimensions based on source image
     * and dimensions of grid square.
     *
     * @return {Object} Object with size data.
     */
    _getBounds(image: HTMLImageElement): {
        sx: number;
        sy: number;
        sw: number;
        sh: number;
        dx: number;
        dy: number;
        dw: number;
        dh: number;
    };
    /**
     * Draws image to virtual canvas which is used to retrieve pixels.
     *
     * @returns
     *
     * @memberOf Picture
     */
    _drawImage(): void;
    /**
     * Loops through all colors, adds all channels together
     * then returns it as a color value.
     *
     * @returns {number} The color.
     *
     * @memberOf Picture
     */
    _calculateAverageColor(pixels: Uint8ClampedArray | undefined): number;
    get width(): number;
    get height(): number;
    get canvas(): HTMLCanvasElement | null;
    get context(): CanvasRenderingContext2D | null;
    get averageColor(): number;
    get image(): HTMLImageElement | null;
    get src(): string | null;
    /**
     * This will redraw the image. Avoid this in loops/raf.
     *
     * @param {Number} width  New width.
     * @param {Number} height New height.
     */
    setSize(width?: number, height?: number, aspectRatio?: number): void;
    /**
     * Returns an array of pixeldata.
     *
     * @returns {Uint8ClampedArray}
     *
     * @memberOf Picture
     */
    getImageData(): Uint8ClampedArray | undefined;
    /**
     * Set image to do analysis on. Image source must be loaded.
     *
     * @param {Image} image
     *
     * @memberOf Picture
     */
    setImage(image: HTMLImageElement): void;
}
