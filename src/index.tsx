import { FC, MouseEvent, useEffect, useRef } from 'react';
import Grid from './models/Grid';
import Picture from './models/Picture';
import { getMousePosition } from './utils/helpers';
import { createTargetPicture } from './utils/target';
import { updateSources } from './utils/sources';
import ImageLoader from './models/ImageLoader';

export type MosaicImageInfo = {
    column: number,
    row: number,
    color: number,
    image: HTMLImageElement
}

type MosaicProps = {
	width?: number,
	height?: number,
	columns?: number,
	rows?: number,
	colorBlending?: number,
	target: string | HTMLImageElement,
	sources: string[],
    crossOrigin?: string | null,
	onClick?: { (info: MosaicImageInfo): void } | null,
	onLoadProgress?: { (progress: number): void } | null
};

export const ReactImageMosaic: FC<MosaicProps> = ({
    width = 400,
    height = 400,
    columns = 40,
    rows = 40,
    colorBlending = 0.8,
    target,
    sources,
    crossOrigin,
    onClick,
    onLoadProgress
}) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const targetPicture = useRef<Picture|null>(null);

    useEffect(() => {
        ImageLoader.crossOrigin = crossOrigin;
    }, [crossOrigin]);

    useEffect(() => {
        Grid.colorBlending = colorBlending;
        drawCanvas();
    }, [colorBlending]);

    useEffect(() => {
        // Load and store the target image.

        if(target) {
            const pixelAspectRatio = (width / columns) / (height / rows);

            createTargetPicture(target, columns, rows, pixelAspectRatio)
                .then(image => {targetPicture.current = image;})
                .then(() => updateGrid());
        }
    }, [target]);

    useEffect(() => {
        // Load and store all source images.

        if(sources) {
            updateSources(sources,
                // A source image is loaded
                (progress) => {
                    if(onLoadProgress) { onLoadProgress(progress) }
                },

                // All source images loaded
                () => {
                    updateGrid()
                }
            );
        }
    }, [sources]);

    useEffect(() => {
        if(canvasRef.current) {
            canvasRef.current.width = width;
            canvasRef.current.height = height;
        }

        Grid.setSize(width, height, columns, rows);

        updateGrid();

    }, [width, height, columns, rows]);

    function updateGrid() {
        if (targetPicture.current && Grid.poolSize > 0) {
            const pixelAspectRatio = (width / columns) / (height / rows);
            targetPicture.current?.setSize(columns, rows, pixelAspectRatio);

            Grid.drawGrid(targetPicture.current)
                .then(() => drawCanvas());
        }
    }
    // -------------------------------------------------------------
    // Listeners

    const clickedCanvas = (event: MouseEvent<HTMLElement>) => {
        if(onClick) {
            const { offset } = getMousePosition(event);

            const col = Math.floor(offset.x / width * columns);
            const row = Math.floor(offset.y / height * rows);
            const color = Grid.getGridSquare(col, row);
            const pic = Grid.getPictureByColor(color);

            onClick({
                column: col,
                row: row,
                color: color,
                image: pic.image
            } as MosaicImageInfo)
        }
    }

    /**
	 * Draw the hidden grid canvas to the visible canvas on the DOM. 
	 * Can be used to force an update of the mosaic.
	 */
    const drawCanvas = () => {

        // Bail if not ready...
        if (!canvasRef?.current || !Grid.isReady) {
            return;
        }

        const context = canvasRef.current.getContext('2d');
        context?.drawImage(
            Grid.canvas as HTMLCanvasElement,
            0, 0,
            width,
            height
        );
    }

    return (
        <canvas
            onClick={ clickedCanvas }
            ref={ canvasRef }
            width={ width }
            height={ height }
        />
    );
};
