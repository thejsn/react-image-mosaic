export default class ImageLoader {
	
	constructor() {
		
		this._loadCount = 0;
		this._completeCount = 0;
	}
	
	loadComplete() {
		this._completeCount++;
		
		if (this._loadCount === this._completeCount) {
			this._completeCount = 0;
			this._loadCount = 0;
		}
	}
	
	//---------------------------------------
	// Getters / setters
	//---------------------------------------
	
	get progress() { 
		return this._loadCount < 1 ? 1 : this._completeCount / this._loadCount 
	}
	
	//---------------------------------------
	// Public methods
	//---------------------------------------
	
	/**
	 * Load an image.
	 * 
	 * @param  {String} url Image url
	 * @return {Promise}
	 */
	load(url) {
		
		this._loadCount++;
		
		return new Promise((resolve, reject) => {
			
			var img = new Image();
			
			img.onload = function(response) {
				
				resolve(img);
				this.loadComplete();
				
			}.bind(this);
			
			img.onerror = function(response) {
				
				reject(response);
				this.loadComplete();
				
			}.bind(this);
			
			img.src = url;
		});
	}
}