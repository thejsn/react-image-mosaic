import React, { Component } from 'react';
import { render } from 'react-dom'
import ReactImageMosaic from '../../src/index';

import Images from '../assets/images.json';

const STATIC = '/assets/';

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
			target: STATIC + 'images/' + Images[8].name
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

	render() {
		return (
			<div>
				<h1>react-image-mosaic Demo</h1>

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
					width={ 800 }
					height={ 800 }
					sources={ Images.map(img => STATIC + 'images/' + img.name) } 
					target={ this.state.target }/>
			</div>
		);
	}
}

render(<Demo/>, document.querySelector('#demo'))
