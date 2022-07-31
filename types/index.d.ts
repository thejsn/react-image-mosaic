import { FC } from 'react';
export declare type MosaicImageInfo = {
    column: number;
    row: number;
    color: number;
    image: HTMLImageElement;
};
declare type MosaicProps = {
    width: number;
    height: number;
    columns: number;
    rows: number;
    colorBlending: number;
    target: string | HTMLImageElement;
    sources: string[];
    onClick: {
        (info: MosaicImageInfo): void;
    };
    onLoadProgress: {
        (progress: number): void;
    };
};
export declare const ReactImageMosaic: FC<MosaicProps>;
export {};
