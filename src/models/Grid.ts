import Picture from "./Picture";

class Grid {

    _colorBlending = 0.2;

    _width = 0;
    _height = 0;

    _columns = 0;
    _rows = 0;

    _colors: number[] = [];
    _gridColors: number[] = [];
    _pictures = new Map<number, Picture>();

    _canvas: HTMLCanvasElement | null = null;
    _context: CanvasRenderingContext2D | null = null;

    // Storing flag to avoid reading pixels from canvas to verify grid.
    _hasSuccessfulPaint = false;

    /**
	 * Creates an instance of Grid.
	 *
	 * @memberOf Grid
	 */
    constructor() {

        if(typeof document !== 'undefined') {
            // eslint-disable-next-line no-undef
            this._canvas = document.createElement('canvas');
            this._context = this._canvas.getContext('2d');
        }
    }

    /**
	 * Return the color in _colors array, that is most similar to the given color.
	 * @param  {number} color Color to match.
	 * @return {number}       Nearest color.
	 */
    getClosestColor(color: number): number {

        const len = this._colors.length,
            sr = color >> 16 & 0xFF,
            sg = color >> 8 & 0xFF,
            sb = color & 0xFF;

        let ret = this._colors[0],
            current = Number.MAX_VALUE,
            red = 0, green = 0, blue = 0,
            diffr = 0, diffg = 0, diffb = 0;

        for (let i = 0; i < len; i++) {
            const c = this._colors[i];

            red		= c >> 16 & 0xFF;
            green	= c >> 8 & 0xFF;
            blue	= c & 0xFF;

            diffr	= red - sr;
            diffg	= green - sg;
            diffb	= blue - sb;

            const distance = Math.sqrt((diffr * diffr) + (diffg * diffg) + (diffb * diffb));

            if (distance === 0) {
                // Exact match, no need to keep looking.
                return c;

            } else if (distance < current) {

                current = distance;
                ret = c;
            }
        }

        return ret;
    }

    resetGridSquares() {
        this._gridColors = [];
    }

    setGridSquare(column: number, row: number, color: number) {
        this._gridColors[column + (row * this._rows)] = color;
    }

    getGridSquare(column: number, row: number): number {
        return this._gridColors[column + (row * this._rows)];
    }

    /**
	 * Returns a Picture with the average
	 * color that closest matches given color.
     * "using as Picture" because Map.get can theoretically return undefined,
     * but not if we using .getClosestColor as key
	 */
    getPictureByColor(color: number): Picture {
        return this._pictures.get(this.getClosestColor(color)) as Picture;
    }

    //---------------------------------------
    // Static
    //---------------------------------------

    //---------------------------------------
    // Getters / setters
    //---------------------------------------

    get isReady() {
        return this._hasSuccessfulPaint;
    }

    get poolSize() {
        return this._colors.length;
    }

    get size() {
        return this._columns * this._rows;
    }

    get colors() {
        return this._colors;
    }

    get canvas() {
        return this._canvas;
    }

    get context() {
        return this._context;
    }

    get colorBlending() {
        return this._colorBlending;
    }

    set colorBlending(value) {
        this._colorBlending = value;
    }

    //---------------------------------------
    // Public methods
    //---------------------------------------

    /**
	 * Set canvas dimenstions in pixels
	 * @param {Number} width  Width in pixels.
	 * @param {Number} height Height in pixels.
	 * @param {Number} columns Number of columns
	 * @param {Number} rows    Number of rows
	 */
    setSize(width: number, height: number, columns: number, rows: number) {

        this._columns = Number(columns);
        this._rows = Number(rows);

        this._width = Number(width);
        this._height = Number(height);

        if(this._canvas) {
            this._canvas.width = this._width;
            this._canvas.height = this._height;
        }

        for (let i = 0; i < this._colors.length; i++) {

            const color = this._colors[i];

            this._pictures.get(color)?.setSize(
                Math.floor(this._width / this._columns),
                Math.floor(this._height / this._rows)
            );
        }
    }

    /**
	 * Add to pool of pictures to use in mosaic.
	 * @param {HTMLImageElement} image A Picture
	 */
    addSourceImage(image: HTMLImageElement) {

        const picture = new Picture(
            image,
            Math.floor(this._width / this._columns),
            Math.floor(this._height / this._rows)
        );

        const color = picture.averageColor;

        // If this color is not already present
        if (!this._pictures.has(color)) {
            // Save color in array for quick search later.
            this._colors.push(color);
        }
        // The average color of the image is its key.
        this._pictures.set(color, picture);

    }

    /**
	 * Remove from pool of pictures to not be used in mosaic anymore.
	 * @param {string} url Picture url to remove
	 */
    removeSourceImage(url: string) {

        // Iterate over _pictures Map
        this._pictures.forEach((picture, color) => {

            if (picture.src === url) {

                //remove color from colors array
                const pos = this._colors.indexOf(color);
                if (pos !== -1) {
                    this._colors.splice(pos, 1);
                }

                //remove image from pictures Map
                this._pictures.delete(color);
            }
        });
    }

    /**
	 * Draw images to grid.
	 */
    drawGrid(target:Picture): Promise<void> {

        return new Promise((resolve, reject) => {

            const pixels = target.getImageData();

            if(!pixels || !this._context || !this._pictures.size) {
                this._hasSuccessfulPaint = false;

                const msg = [
                    !pixels && 'Target has no image data (pixels).',
                    !this._context && 'Grid canvas context is not set.',
                    !this._pictures.size && 'Sources are not loaded.',
                ].filter(m=>m);

                reject(msg.join(', '));
                return;
            }

            this.resetGridSquares();

            const blending = this._colorBlending;
            let pic: Picture | null = null;

            let i = 0, // index
                j = 0, // pixel position (ix4)
                x = 0, // x pos
                y = 0, // y pos
                c = 0, // col
                r = 0, // row
                red	= 0,
                green = 0,
                blue = 0,
                color;

            const w = (this._width / this._columns),
                h = (this._height / this._rows),
                cols = this._columns,
                ctx = this._context,
                len	= pixels.length / 4;

            for (i = 0; i < len; i++) {
                j = i * 4;
                red 	= pixels[j];
                green 	= pixels[j+1];
                blue 	= pixels[j+2];

                color = red << 16 | green << 8 | blue;
                c = i % cols;
                r = Math.floor(i / cols);
                x = c * w;
                y = r * h;

                this.setGridSquare(c, r, color);

                if (blending < 1) {
                    pic = this.getPictureByColor(color);
                    ctx.drawImage(
                        pic.canvas as CanvasImageSource,
                        x, y, w, h
                    );
                }

                if (blending > 0) {
                    ctx.fillStyle = 'rgba('+red+', '+green+', '+blue+', '+blending+')';
                    ctx.fillRect(x, y, w, h);
                }
            }

            this._hasSuccessfulPaint = true;
            resolve();
        });
    }
}

export default new Grid();
