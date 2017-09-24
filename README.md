# react-image-mosaic

Creates an image mosaic in a canvas element.

![Image mosaic example](https://thejsn.github.io/react-image-mosaic/assets/examples/cat.png)

## Installation

`npm i react-image-mosaic`

## Basic Usage

```
import ReactImageMosaic from 'react-image-mosaic'

<ReactImageMosaic
    width={ 400 }
    height={ 400 }
    sources={ ['path/to/image.jpg', 'path/to/image2.jpg'] } 
    target={ 'path/to/image.jpg' } />
```

## Examples

[Interactive example with loader](https://thejsn.github.io/react-image-mosaic/) - [source](https://github.com/thejsn/react-image-mosaic/blob/master/demo/src/index.js)

## Settings

`ReactImageMosaic` has the following props:

| prop | default | description |
| --- | --- | --- |
| `width` | 400 | The width of the canvas. |
| `height` | 400 | The height of the canvas. |
| `columns` | 40 | The number of columns of images in the mosaic. |
| `rows` | 40 | The number of rows of images in the mosaic. |
| `colorBlending` | 08 | The amount of blending between each image and its matching color. A number between 0 and 1. |
| `target` | null | The target image to recreate. Can be a string or an image, the string is assumed to be a url to an image. |
| `sources` | [] | An array with urls to images to be used to build the mosaic. |
| `onClick` |  | A function that is called when user clicks on the canvas. Receives some information about the image clicked. |
| `onLoadProgress` |  | A function called every time a source image has loaded. Receives the progress as a number between 0 and 1. |

## License

The MIT License (MIT)