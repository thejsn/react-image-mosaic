import React, { Component } from 'react';
import { render } from 'react-dom'
import ReactImageMosaic from '../../src/index';

import Images from '../assets/images.json';
import './index.css';

const STATIC = 'assets/';

export default class Demo extends Component {

    constructor(props) {
        super(props);
        this.loadProgressChanged = this.loadProgressChanged.bind(this);
        this.clickedCanvas = this.clickedCanvas.bind(this);
        this.state = {
            loadProgress: 0,
            target: null
        }
    }

    componentDidMount() {
        this.setState({
            target: STATIC + 'images/' + Images[4].name
        });
    }

    clickedCanvas(data) {
        this.setState({
            target: data.image
        });
    }

    loadProgressChanged(progress) {
        this.setState({
            loadProgress: progress
        });
    }

    getImgSrc(img) {
        return typeof img === 'string' ? img : img.src;
    }

    render() {
        return (
            <div className="demo-container">
                <h1>react-image-mosaic</h1>

                <p>
                    <a href="https://github.com/thejsn/react-image-mosaic">Source on GitHub</a>
                </p>

                { this.state.loadProgress < 1 ? (
                    <pre>
					Loading { Images.length } images...
					({ Math.round(this.state.loadProgress * 100) }%)
                    </pre>
                ) : null }

                <ReactImageMosaic
                    onClick={ this.clickedCanvas }
                    onLoadProgress={ this.loadProgressChanged }
                    colorBlending={ 0.6 }
                    width={ 600 }
                    height={ 600 }
                    columns={ 60 }
                    rows={ 60 }
                    sources={ Images.map(img => STATIC + 'images/' + img.name) }
                    target={ this.state.target } />

                { this.state.loadProgress >= 1 ? (
                    <p className="note">
						Click a tile to set it as target image.
                    </p>
                ) : null }

                { this.state.target ? (
                    <div>
                        <img src={ this.getImgSrc( this.state.target ) } alt="" />
                        <p className="note">
							Current target image.
                        </p>
                    </div>
                ) : null }

                <p>
					Images from <a href="https://unsplash.com/" target="_blank">Unsplash</a>.
                </p>
            </div>
        );
    }
}

render(<Demo/>, document.querySelector('#demo'))
