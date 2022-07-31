class ImageLoader {

    _loadCount = 0;
    _completeCount = 0;

    constructor() {
        this.loadComplete = this.loadComplete.bind(this);
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
    load(url: string): Promise<HTMLImageElement> {
        this._loadCount++;
        return this.loadImage(url, this.loadComplete);
    }

    /**
     * 
     * @param urls 
     * @param onProgress 
     * @returns 
     */
    loadAll(
        urls: string[],
        onProgress: { (progress: number): void } | null
    ): Promise<HTMLImageElement[]> {
        this._loadCount += urls.length;

        return Promise.allSettled( urls.map(url => this.loadImage(url, this.loadComplete, onProgress)) )
            .then(results => results.map(res => res.status === 'fulfilled' ? res.value : null))
            .then(results => results.filter(isImage));
    }

    loadImage(
        url: string,
        onComplete: { (): void } | null = null,
        onProgress: { (progress:number): void } | null = null,
    ): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {

            // eslint-disable-next-line no-undef
            const img = new Image();

            img.onload = () => {
                resolve(img);

                if(onComplete) { onComplete(); }
                if(onProgress) { onProgress(this.progress); }
            }

            img.onerror = (response) => {
                reject(response);

                if(onComplete) { onComplete(); }
                if(onProgress) { onProgress(this.progress); }
            }

            img.src = url;
        });
    }
}

export default new ImageLoader();

function isImage(image: any): image is HTMLImageElement {
    return image instanceof HTMLImageElement
}
