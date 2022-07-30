import { FC } from 'react';

declare type ImageInfo = {
    column: number;
    row: number;
    color: number;
    image: HTMLImageElement;
};
declare type Props = {
    width: number;
    height: number;
    columns: number;
    rows: number;
    colorBlending: number;
    target: string | HTMLImageElement;
    sources: string[];
    onClick: {
        (info: ImageInfo): void;
    };
    onLoadProgress: {
        (progress: number): void;
    };
};
declare const ReactImageMosaic: FC<Props>;

export { ReactImageMosaic };
