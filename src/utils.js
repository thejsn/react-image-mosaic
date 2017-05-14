
export function hasChanged(a, b, type) {
	switch (type) {
		case 'string':
		case 'number':
			return a !== b;
		case 'object':
			if(a && b && typeof a.length !== 'undefined') {
				// array, just compare lengths
				return a.length !== b.length;
			} else {
				// objects not supported...
				return false;
			}
		default:
			return false;
	}
}


export function propHasChanged(name, next, prev) {
	if(typeof name === 'string') {
		return hasChanged(next[name], prev[name], typeof next[name]);
	} else if(typeof name === 'object' && name.length) {
        // 'every' returns when it hits a false value, we're looking 
        // for first true value, that's why it's inverted twice.
		return !name.every(n => !hasChanged(next[n], prev[n], typeof next[n]));
	}
}

/**
 * From https://gist.github.com/branneman/fc66785c082099298955
 * @param {Event} evt
 * @return {Object}
 */
export function getMousePosition(evt) {

  var pageX = evt.pageX;
  var pageY = evt.pageY;
  if (pageX === undefined) {
    pageX = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    pageY = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  var rect = evt.target.getBoundingClientRect();
  var offsetX = evt.clientX - rect.left;
  var offsetY = evt.clientY - rect.top;

  return {
    client: { x: evt.clientX, y: evt.clientY }, // relative to the viewport
    screen: { x: evt.screenX, y: evt.screenY }, // relative to the physical screen
    offset: { x: offsetX,     y: offsetY },     // relative to the event target
    page:   { x: pageX,       y: pageY }        // relative to the html document
  };
}