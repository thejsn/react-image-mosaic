import { MouseEvent } from 'react';
/**
 * From https://gist.github.com/branneman/fc66785c082099298955
 * @param {MouseEvent} event
 * @return {Object}
 */
export declare function getMousePosition(event: MouseEvent<HTMLElement>): {
    client: {
        x: number;
        y: number;
    };
    screen: {
        x: number;
        y: number;
    };
    offset: {
        x: number;
        y: number;
    };
    page: {
        x: number;
        y: number;
    };
};
