/**
 * LaSEO - SEO friendly lazdy images loading
 * made to get rid of SEO connected rage while
 * trying to make a fast website
 */

;
(function(window, document, undefined) {

    /**
     * Extend one object
     * with properties from another
     */
    var _extend = function(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) a[key] = b[key];
        }
        return a;
    }

    /**
     * Underscore helpers
     * Don't touch it
     */
    var _now = Date.now || function() {
        return new Date().getTime();
    };

    var _debounce = function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function() {
            var last = _now() - timestamp;

            if (last < wait && last > 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };

        return function() {
            context = this;
            args = arguments;
            timestamp = _now();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
    };

    /**
     * Private variables
     */
    var _elements = [];

    /**
     * Default options
     */
    var options = {
        blankImg: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        offset: 100
    };

    /**
     * Methods
     */
    var settings = function(settings) {
        options = _extend(options, settings);
    };

    /**
     * Get offset of DOM element Helper
     * including these with translation properly as well
     *
     * @param  {Node} el [DOM element]
     * @return {Object} [top and left offset]
     */
    var getOffset = function(el) {
        var _x = 0;
        var _y = 0;

        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - (el.tagName != 'BODY' ? el.scrollTop : 0);
            _y += el.offsetTop - (el.tagName != 'BODY' ? el.scrollLeft : 0);
            el = el.offsetParent;
        }

        return {
            top: _y,
            left: _x
        };
    }

    var inViewport = function(el) {
        return getOffset(el).top <= window.innerHeight + window.scrollY + options.offset;
    };

    var loadDiscretly = function(el) {
        var src = el.getAttribute('data-laseo-src');
        var curImg = new Image();

        curImg.src = src;
        curImg.onload = function(){
            el.setAttribute('src', src);
        }
    };

    var loadVisible = function() {
        var _newArray = [];
        for (var i = 0; i < _elements.length; i++) {
            if (inViewport(_elements[i]) && _elements[i].hasAttribute('data-laseo-src')) {
                loadDiscretly(_elements[i]);
                _elements[i] = false;
            } else {
                _newArray.push(_elements[i]);
            }
        }
        _elements = _newArray;
    };

    /**
     * Cancel loading images
     */
    document.addEventListener('DOMContentLoaded', function() {
        _elements = document.querySelectorAll('[data-laseo="true"]');
        var tempSrc = '';
        for (var i = 0; i < _elements.length; i++) {
            tempSrc = _elements[i].getAttribute('src');
            _elements[i].setAttribute('src', options.blankImg);
            _elements[i].setAttribute('data-laseo-src', tempSrc);
        }

        loadVisible();
    });

    window.addEventListener('resize', _debounce(loadVisible, 50, true));
    window.addEventListener('orientationchange', _debounce(loadVisible, 50, true));
    window.addEventListener('scroll', _debounce(loadVisible, 15, true));

    /**
     * Expose some functions
     * to the outside world
     * through API
     */
    var api = {
        settings: settings,
        load: loadVisible
    };

    /**
     * Set API to be available
     * in window context
     */
    window.laseo = api;

})(window, document);