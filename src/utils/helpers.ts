import { MouseEvent } from 'react';

const hasDoc = typeof document === 'undefined';

/**
 * From https://gist.github.com/branneman/fc66785c082099298955
 * @param {MouseEvent} event
 * @return {Object}
 */
export function getMousePosition(event: MouseEvent<HTMLElement>) {
    let pageX = event.pageX;
    let pageY = event.pageY;

    if (hasDoc && pageX === undefined) {
        // eslint-disable-next-line no-undef
        pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        // eslint-disable-next-line no-undef
        pageY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    return {
        client: { x: event.clientX, y: event.clientY }, // relative to the viewport
        screen: { x: event.screenX, y: event.screenY }, // relative to the physical screen
        offset: { x: offsetX,     y: offsetY },     // relative to the event target
        page:   { x: pageX,       y: pageY }        // relative to the html document
    };
}
