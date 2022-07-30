import Picture from "./Picture";
declare class Grid {
    _colorBlending: number;
    _width: number;
    _height: number;
    _columns: number;
    _rows: number;
    _colors: number[];
    _gridColors: number[];
    _pictures: Map<any, any>;
    _canvas: HTMLCanvasElement | null;
    _context: CanvasRenderingContext2D | null;
    _hasSuccessfulPaint: boolean;
    /**
     * Creates an instance of Grid.
     *
     * @memberOf Grid
     */
    constructor();
    /**
     * Return the color in _colors array, that is most similar to the given color.
     * @param  {number} color Color to match.
     * @return {number}       Nearest color.
     */
    getClosestColor(color: number): number;
    resetGridSquares(): void;
    setGridSquare(column: number, row: number, color: number): void;
    getGridSquare(column: number, row: number): number;
    /**
     * Returns a Picture with the average
     * color that closest matches given color.
     */
    getPictureByColor(color: number): Picture;
    get isReady(): boolean;
    get poolSize(): number;
    get size(): number;
    get colors(): number[];
    get canvas(): HTMLCanvasElement | null;
    get context(): CanvasRenderingContext2D | null;
    get colorBlending(): number;
    set colorBlending(value: number);
    /**
     * Set canvas dimenstions in pixels
     * @param {Number} width  Width in pixels.
     * @param {Number} height Height in pixels.
     * @param {Number} columns Number of columns
     * @param {Number} rows    Number of rows
     */
    setSize(width: number, height: number, columns: number, rows: number): void;
    /**
     * Add to pool of pictures to use in mosaic.
     * @param {HTMLImageElement} image A Picture
     */
    addSourceImage(image: HTMLImageElement): void;
    /**
     * Draw images to grid.
     */
    drawGrid(target: Picture): Promise<void>;
}
declare const _default: Grid;
export default _default;
