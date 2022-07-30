class ImageLoader {

    _loadCount = 0;
    _completeCount = 0;

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
    load(url: string): Promise<HTMLImageElement> {

        this._loadCount++;

        return new Promise((resolve, reject) => {

            // eslint-disable-next-line no-undef
            const img = new Image();

            img.onload = () => {
                resolve(img);
                this.loadComplete();
            }

            img.onerror = (response) => {
                reject(response);
                this.loadComplete();
            }

            img.src = url;
        });
    }
}

export default new ImageLoader();
