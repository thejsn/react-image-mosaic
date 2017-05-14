import React, { Component } from 'react'
import ImageLoader from './imageLoader';
import Grid from './grid';
import Picture from './picture';
import { isSame, propHasChanged , getMousePosition} from './utils';

export default class ReactImageMosaic extends Component {
	
	constructor(props) {
		super(props);
		
		this.drawCanvas = this.drawCanvas.bind(this);
		this.addSourceFromURL = this.addSourceFromURL.bind(this);
		this.clickedCanvas = this.clickedCanvas.bind(this);

		this._target;
		this._grid = new Grid();
		this._loader = new ImageLoader();
	}

	//----------------------------------------------------------------
	//
	// Properties - Getters / Setters
	//
	//----------------------------------------------------------------
	
	/**
	 * The load progress of images added as URLs. Not very accurate 
	 * since only completely loaded images are counted towards progress.
	 * 
	 * @readonly
	 * 
	 * @return {Number} A value between 0 and 1.
	 */
	get loadProgress() { return this._loader.progress; }
	

	/**
	 * The pixel aspect ratio of the cells in the grid, represented 
	 * as a single float value.
	 * If the ratio is 16:9, the value will be 16/9, or 1.77777777778.
	 * 
	 * @readonly
	 * 
	 * @return {Number}
	 */
	getPixelAspectRatio(width, height, columns, rows) { 
		return (width / columns) / 
			   (height / rows);
	}
	
	
	/**
	 * The canvas that holds the mosaic.
	 * 
	 * @readonly
	 * 
	 * @return {Element} A Canvas element.
	 */
	get canvas() {
		return this.refs.canvas;
	}
	
	//----------------------------------------------------------------
	//
	// Private
	//
	//----------------------------------------------------------------
	
	
	/**
	 * Handle load status change. Redraw grid if ready.
	 * 
	 * @private
	 */
	loadStatusChanged() {
		if (this._loader.progress == 1 && !!this._target) {
			this._grid.setTarget(this._target)
				.then(this.drawCanvas);
		}
	}
	

	/**
	 * Draw the hidden grid canvas to the visible canvas on the DOM. 
	 * Can be used to force an update of the mosaic.
	 * 
	 * @example
	 * mosaic.draw();
	 * 
	 * @public
	 */
	drawCanvas() {
		
		if (!this.canvas) {
			return;
		}

		const context = this.canvas.getContext('2d');
		
		context.fillRect(10, 10, 100, 100);
		context.drawImage(
			this._grid.canvas, 
			0, 0, 
			this.props.width, 
			this.props.height
		);

		if (typeof this.onDraw !== 'undefined') {
			this.onDraw(this._grid);
		}
	}
	
	
	/**
	 * Set the size of the canvas. Any falsy value will be ignored (such 
	 * as 0). This function will redraw the canvas and all grid images so 
	 * it should not be used in the render() function.
	 * 
	 * @example
	 * // Set the height and number of columns
	 * mosaic.setSize(0, 200, 20)
	 * 
	 * @public
	 * 
	 * @param {Number} [width=0]   Width in pixels
	 * @param {Number} [height=0]  Height in pixels
	 * @param {Number} [columns=0] Number of columns
	 * @param {Number} [rows=0]    Number of rows
	 */
	setSize(width = 0, height = 0, columns = 0, rows = 0) {
		
		this.canvas.width = width;
		this.canvas.height = height;
		
		this._grid.setSize(width, height, columns, rows);
		
		if (!!this._target && this._grid.poolSize > 0) {
			
			this._target.setSize(columns, rows, 
				this.getPixelAspectRatio(width, height, columns, rows));
			
			return this._grid.drawGrid()
				.then(this.drawCanvas);
		}
	}
	
	handleTargetProp(target) {
		
		if(typeof target === 'string') {
			// Assume it's a url..
			this.setTargetFromURL(target);
		} else if(typeof target === 'object' && target.src) {
			// Assume it's an Image...
			this.setTargetImage(target);
		}
	}
	
	/**
	 * Set the target image, from URL.
	 * 
	 * @example
	 * mosaic.setTargetFromURL('path/to/image.jpg');
	 * 
	 * @public
	 * 
	 * @param {String} url Path to image
	 */
	setTargetFromURL(url) {
		
		this._loader.load(url)
			.then(image => {
				
				this.setTargetImage(image);
				
			})
			.catch(error => {
				
				// console.warn('[mosaic.js] Error loading ' + url + ' - ', error);
				
			})
			.then(() => {
				
			});
	}
	
	
	/**
	 * Set the image to be built directly.
	 * 
	 * @example
	 * var image = new Image()
	 * image.src = 'http://path/to/image.jpg'
	 * image.onLoad = function() {
	 * 	mosaic.setTargetImage(image)
	 * }
	 * 
	 * @public
	 * 
	 * @param  {Image} image
	 */
	setTargetImage(image) {
		
		this._target = new Picture(
			image, 
			this.props.columns,
			this.props.rows,
			this.pixelAspectRatio
		);
		
		this.loadStatusChanged();
	}
	
	
	/**
	 * Add image to be used in the grid from URL.
	 * 
	 * @example
	 * mosaic.addSourceFromURL('path/to/image.jpg');
	 * 
	 * @public
	 * 
	 * @param {String} url Path to image
	 */
	addSourceFromURL(url) {
		
		this._loader.load(url)
			.then(image => {
				
				this.addSource(image);
				
			})
			.catch(error => {
				
				console.warn('[mosaic.js] Error loading ' + url + ' - ', error);
				
			})
			.then(() => {
				
				if(this.props.onLoadProgress) {
					this.props.onLoadProgress(this._loader.progress);
				}

				if (this._loader.progress == 1) {
					this.loadStatusChanged();
				}
			});
	}
	
	
	/**
	 * Add image to be used in the grid directly. The image should be 
	 * completely loaded before being added.
	 * 
	 * @private
	 * 
	 * @param  {Image} image 
	 */
	addSource(image) {
		
		let picture = new Picture(
			image, 
			Math.floor(this.props.width / this.props.columns),
			Math.floor(this.props.height / this.props.rows)
		);
		
		this._grid.addPicture(picture);
	}


	/**
	 * Handle click on canvas. Return info on clicked image.
	 * 
	 * @param {any} e 
	 * 
	 * @memberOf ReactImageMosaic
	 */
	clickedCanvas(e) {
		if(this.props.onClick) {
			const { width, columns, height, rows } = this.props;
			const { offset } = getMousePosition(e);

			const col = Math.floor(offset.x / width * columns);
			const row = Math.floor(offset.y / height * rows);
			const color = this._grid.getGridSquare(col, row);
			const pic = this._grid.getPictureByColor(color);
			
			this.props.onClick({
				column: col,
				row: row,
				color: color,
				image: pic.image
			})
		}
	}
	
	//----------------------------------------------------------------
	//
	// React lifecycle
	//
	//----------------------------------------------------------------
	
	componentDidMount() {

		this.canvas.width = this.props.width;
		this.canvas.height = this.props.height;

		this._grid.colorBlending = this.props.colorBlending;

		this.setSize(
			this.props.width, 
			this.props.height, 
			this.props.columns, 
			this.props.rows
		);

		if(this.props.sources.length) {
			this.props.sources.forEach(this.addSourceFromURL)
		}

		if(this.props.target) {
			this.handleTargetProp(this.props.target);
		}
	}

	componentWillReceiveProps(next) {

		if(next.target && next.target !== this.props.target) {
			this.handleTargetProp(next.target);
		}

		if(propHasChanged('sources', next, this.props)) {
			next.sources.filter(
				source => this.props.sources.indexOf(source) === -1
			).forEach(this.addSourceFromURL);
		}

		if(propHasChanged('colorBlending', next, this.props)) {
			this._grid.colorBlending = next.colorBlending;
			this._grid.drawGrid()
				.then(this.drawCanvas);
		}

		if(propHasChanged(
			['width', 'height', 'columns', 'rows'], 
			next, this.props)) {
			this.setSize(
				next.width, 
				next.height, 
				next.columns, 
				next.rows
			);
		}
	}
	
	render() {
		return <canvas 
				onClick={ this.clickedCanvas }
				ref="canvas"
				width={ this.props.width } 
				height={ this.props.height } />
	}
}

ReactImageMosaic.defaultProps = {
	width: 400,
	height: 400,
	columns: 40,
	rows: 40,
	colorBlending: 0.8,
	target: null,
	sources: [], 
	onClick: () => {},
	onLoadProgress: () => {}
}
