import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { ReactImageMosaic } from '../../dist/esm/index';
import Images from '../assets/images.json';
import './index.css';

const STATIC = 'assets/';

const Demo = () => {

    const [columns, setColumns] = useState(60);
    const [rows, setRows] = useState(60);
    const [blending, setBlending] = useState(0.6);

    const [progress, setProgress] = useState(0);
    const [targetImage, setTargetImage] = useState(STATIC + 'images/' + Images[4].name);

    function clickedCanvas(data) {
        setTargetImage(data.image);
    }

    function loadProgressChanged(progress) {
        setProgress(progress);
    }

    function getImgSrc(img) {
        return typeof img === 'string' ? img : img.src;
    }

    return (
        <div className="demo-container">
            <h1>react-image-mosaic</h1>

            <p>
                <a href="https://github.com/thejsn/react-image-mosaic">Source on GitHub</a>
            </p>

            { progress < 1 ? (
                <pre className="loading">
                    Loading { Images.length } images...
                    ({ Math.round(progress * 100) }%)
                </pre>
            ) : null }

            <div className="mosaic-container">
                <ReactImageMosaic
                    onClick={ clickedCanvas }
                    onLoadProgress={ loadProgressChanged }
                    colorBlending={ blending }
                    width={ 600 }
                    height={ 600 }
                    columns={ columns }
                    rows={ rows }
                    sources={ Images.map(img => STATIC + 'images/' + img.name) }
                    target={ targetImage }
                />
            </div>

            <div className="controls-container">
                <div className="control">
                    <label htmlFor="input-columns">
                        <pre>Columns</pre>
                    </label>
                    <input
                        type="number"
                        id="input-columns"
                        min={ 1 }
                        value={ columns }
                        onChange={e => setColumns(e.target.value) }
                    />
                </div>

                <div className="control">
                    <label htmlFor="input-rows">
                        <pre>Rows</pre>
                    </label>
                    <input
                        type="number"
                        id="input-rows"
                        min={ 1 }
                        value={ rows }
                        onChange={e => setRows(e.target.value) }
                    />
                </div>

                <div className="control">
                    <label htmlFor="input-blending">
                        <pre>Color blending</pre>
                    </label>
                    <input
                        type="number"
                        id="input-blending"
                        min={ 0 }
                        max={ 1 }
                        step={ 0.01 }
                        value={ blending }
                        onChange={e => setBlending(e.target.value) }
                    />
                </div>
            </div>

            { targetImage ? (
                <div className='target-image'>
                    <img
                        width={ 600 }
                        src={ getImgSrc( targetImage ) }
                        alt="Target mosaic image" />
                    <p className="note">
                        Current target image.
                    </p>
                </div>
            ) : null }

            <p>
                Images from <a href="https://unsplash.com/" target="_blank">Unsplash</a>.
            </p>
        </div>
    )
}

// eslint-disable-next-line no-undef
const root = createRoot(document.querySelector('#demo'));
root.render(<Demo />);
