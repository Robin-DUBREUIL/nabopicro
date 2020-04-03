/**
 * nabopicro
 * @version 0.1
 * @author Robin DUBREUIL <robin@dubreuil.pro>
 * You want to see more of my work? visit my github! https://github.com/TheCodeExorcist/
 *
 * Nabopicro is based on the jQuery dependent https://github.com/dsalvagni/profile-picture
 * There may be other contributors to this awesome project, visit
 * https://github.com/TheCodeExorcist/nabopicro for a complete list.
 *
 * This project is MIT licensed. For more information, visit https://opensource.org/licenses/MIT
 */


/**
 * Turn the globals into local variables.
 */
; (function (window, undefined) {
    if (!window.nabopicro) {
        window.nabopicro = nabopicro;
    }

    /**
     * Component
     */
    function nabopicro(cssSelector, imageFilePath, options) {
        var self = this;
        /**
         * Map the DOM elements
         */
        self.element = document.querySelector(cssSelector);
        self.photoHelper = self.element.getElementsByClassName("photo__helper")[0];
        self.photoOptions = self.element.getElementsByClassName("photo__options")[0];
        self.photoArea = self.element.getElementsByClassName("photo")[0];
        self.zoomControl = self.element.getElementsByClassName("zoom-handler")[0];
        self.photoFrame = self.element.getElementsByClassName("photo__frame")[0];
        self.canvas = self.photoFrame.getElementsByClassName("photo__canvas")[0];
        self.photoLoading = self.photoFrame.getElementsByClassName("message.is-loading")[0];
        /**
         * Image info to post to the API
         */
        self.model = {
            imageSrc: null,
            width: null,
            height: null,
            originalWidth: null,
            originalHeight: null,
            y: null,
            x: null,
            zoom: 1,
            cropWidth: null,
            cropHeight: null,
            file: null
        };


        /**
         * Plugin options
         */
        self.options = {};
        /**
         * Plugins defaults
         */
        self.defaults = {};
        self.defaults.imageHelper = true;
        self.defaults.imageHelperColor = "rgba(255,255,255,.90)";
        /**
         * Callbacks
         */
        self.defaults.onChange = null;
        self.defaults.onZoomChange = null;
        self.defaults.onImageSizeChange = null;
        self.defaults.onPositionChange = null;
        self.defaults.onLoad = null;
        self.defaults.onRemove = null;
        self.defaults.onError = null;
        /**
         * Zoom default options
         */
        self.defaults.zoom = {
            initialValue: 1,
            minValue: 0.1,
            maxValue: 2,
            step: 0.01
        };
        /**
         * Image default options
         */
        self.defaults.image = {
            originalWidth: 0,
            originalHeight: 0,
            originaly: 0,
            originalX: 0,
            minWidth: 350,
            minHeight: 350,
            maxWidth: 1000,
            maxHeight: 1000
        };

        /**
         * Call the constructor
         */
        init(cssSelector, imageFilePath, options);

        /**
         * Return public methods
         */
        return {
            getData: getData.bind(this),
            getAsDataURL: getAsDataURL.bind(this),
            removeImage: removeImage.bind(this)
        };



        /**
         * Constructor
         * Register all components and options.
         * Can load a preset image
         */
        function init(cssSelector, imageFilePath, options) {
            /**
             * Start canvas
             */
            self.canvas.width = self.photoFrame.offsetWidth;
            self.canvas.height = self.photoFrame.offsetHeight;
            self.canvasContext = self.canvas.getContext('2d');
            /**
             * Merge the defaults with the user options
             */
            self.options = Object.assign(self.defaults, options);

            /**
             * Enable/disable the image helper
             */
            if (self.options.imageHelper) {
                registerImageHelper();
            }

            registerDropZoneEvents();
            registerImageDragEvents();
            registerZoomEvents();

            /**
             * Start
             */
            if (imageFilePath) {
                processFile(imageFilePath);
            } else {
                self.photoArea.classList.add('photo--empty');
            }
        }
        /**
         * Return the model
         */
        function getData() {
            return this.model;
        }
        /**
         * Set the model
         */
        function setModel(model) {
            self.model = model;
        }
        /**
         * Set the image to a canvas
         */
        function processFile(imageUrl) {
            function isDataURL(s) {
                s = s.toString();
                return !!s.match(isDataURL.regex);
            }
            isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

            var image = new Image();
            if (!isDataURL(imageUrl)) {
                image.crossOrigin = 'anonymous';
            }
            self.photoArea.classList.add('photo--loading');
            image.onload = function () {
                var ratio,
                    newH, newW,
                    w = this.width, h = this.height;

                if (w < self.options.image.minWidth ||
                    h < self.options.image.minHeight) {
                    self.photoArea.classList.add("photo--error--image-size", "photo--empty");
                    setModel({});

                    /**
                     * Call the onError callback
                     */
                    if (typeof self.options.onError === 'function') {
                        self.options.onError('image-size');
                    }

                    self.photoArea.classList.remove('photo--loading');
                    return;
                } else {
                    self.photoArea.classList.remove('photo--error--image-size');
                }
                self.photoArea.classList.remove("photo--empty", "photo--error--file-type", "photo--loading");
                var frameRatio = self.options.image.maxHeight / self.options.image.maxWidth;
                var imageRatio = self.model.height / self.model.width;

                if (frameRatio > imageRatio) {
                    newH = self.options.image.maxHeight;
                    ratio = (newH / h);
                    newW = parseFloat(w) * ratio;
                } else {
                    newW = self.options.image.maxWidth;
                    ratio = (newW / w);
                    newH = parseFloat(h) * ratio;
                }
                h = newH;
                w = newW;

                self.model.imageSrc = image;
                self.model.originalHeight = h;
                self.model.originalWidth = w;
                self.model.height = h;
                self.model.width = w;
                self.model.cropWidth = self.photoFrame.offsetWidth;
                self.model.cropHeight = self.photoFrame.offsetHeight;
                self.model.x = 0;
                self.model.y = 0;
                self.photoOptions.classList.remove('hide');
                self.photoHelper.style.cursor = 'move';
                fitToFrame();
                render();

                /**
                 * Call the onLoad callback
                 */
                if (typeof self.options.onLoad === 'function') {
                    self.options.onLoad(self.model);
                }

            };

            image.src = imageUrl;
        }
        /**
         * Remove the image and reset the component state
         */
        function removeImage() {
            self.canvasContext.clearRect(0, 0, self.model.cropWidth, self.model.cropHeight);
            self.canvasContext.save();
            self.photoArea.classList.add('photo--empty');
            self.imageHelperCanvasContext.clearRect(0, 0, self.imageHelperCanvas.width,self.imageHelperCanvas.height);
            self.imageHelperCanvasContext.save();
            setModel({});

            /**
             * Call the onRemove callback
             */
            if (typeof self.options.onRemove === 'function') {
                self.options.onRemove(self.model);
            }
        }

        /**
         * Register the file drop zone events
         */
        function registerDropZoneEvents() {
            var target = null;
            /**
             * Stop event propagation to all dropzone related events.
             */
            addEventListeners(self.element, "drag dragstart dragend dragover dragenter dragleave drop", function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
            });

            /**
             * Register the events when the file is out or dropped on the dropzone
             */
            addEventListeners(self.element, "dragend dragleave drop", function(e) {
                if (target === e.target) {
                    self.element.classList.remove('is-dragover');
                }
            });
            /**
             * Register the events when the file is over the dropzone
             */
            addEventListeners(self.element, "dragover dragenter", function(e) {
                target = e.target;
                self.element.classList.add('is-dragover');
            });
            /**
             * On a file is selected, calls the readFile method.
             * It is allowed to select just one file - we're forcing it here.
             */
            addEventListeners(self.element, 'change', function(e) {
                var files = event.target.files
                if (files && files.length) {
                    readFile(files[0]);
                    event.target.value = '';
                }
            }, 'input[type=file]');
            /**
             * Handle the click to the hidden input file so we can browser files.
             */
            addEventListeners(self.element, 'click', function(e) {
                self.element.querySelector("input[type=file]").click();
            }, '.photo--empty .photo__frame');
            /**
             * Register the remove action to the remove button.
             */
            addEventListeners(self.element, 'click', function(e) {
                self.photoHelper.style.cursor = "auto";
                removeImage();
            }, '.remove');
            /**
             * Register the drop element to the container component
             */
            addEventListeners(self.element, 'drop', function(e) {
                readFile(e.dataTransfer.files[0]);
            });


            /**
             * Only into the DropZone scope.
             * Read a file using the FileReader API.
             * Validates file type.
             */
            function readFile(file) {
                self.photoArea.classList.remove("photo--error", "photo--error--file-type", "photo--error-image-size");
                /**
                 * Validate file type
                 */
                if (!file.type.match('image.*')) {
                    self.photoArea.classList.add('photo--error--file-type');
                    /**
                     * Call the onError callback
                     */
                    if (typeof self.options.onError === 'function') {
                        self.options.onError('file-type');
                    }
                    return;
                }

                var reader;
                reader = new FileReader();
                reader.onloadstart = function () {
                    self.photoArea.classList.add('photo--loading');
                }
                reader.onloadend = function (data) {
                    var base64Image = data.target.result;
                    processFile(base64Image, file.type);
                }
                reader.onerror = function () {
                    self.photoArea.classList.add('photo--error');
                    /**
                     * Call the onError callback
                     */
                    if (typeof self.options.onError === 'function') {
                        self.options.onError('unknown');
                    }
                }
                self.model.file = file;
                reader.readAsDataURL(file);
            }
        }
        /**
         * Register the image drag events
         */
        function registerImageDragEvents() {
            var $dragging, x, y, clientX, clientY;
            if(self.options.imageHelper) {
                addEventListeners(self.photoHelper, "mousedown touchstart", dragStart);
            } else {
                addEventListeners(self.photoFrame, "mousedown touchstart", dragStart);
            }

            /**
             * Stop dragging
             */
            addEventListeners(window, "mouseup touchend", function (e) {
                if ($dragging) {
                    /**
                     * Call the onPositionChange callback
                     */
                    if (typeof self.options.onPositionChange === 'function') {
                        self.options.onPositionChange(self.model);
                    }
                    /**
                     * Call the onChange callback
                     */
                    if (typeof self.options.onChange === 'function') {
                        self.options.onChange(self.model);
                    }
                }
                $dragging = null;
            });
            /**
             * Drag the image inside the container
             */
            addEventListeners(window, "mousemove touchmove", function (e) {

                if ($dragging) {
                    e.preventDefault();
                    var refresh = false;
                    clientX = e.clientX;
                    clientY = e.clientY;
                    if (e.touches) {
                        clientX = e.touches[0].clientX
                        clientY = e.touches[0].clientY
                    }

                    var dy = (clientY) - y;
                    var dx = (clientX) - x;
                    dx = Math.min(dx, 0);
                    dy = Math.min(dy, 0);
                    /**
                     * Limit the area to drag horizontally
                     */
                    if (self.model.width + dx >= self.model.cropWidth) {
                        self.model.x = dx;
                        refresh = true;
                    }
                    if (self.model.height + dy >= self.model.cropHeight) {
                        self.model.y = dy;
                        refresh = true;
                    }
                    if (refresh) {
                        render();
                    }
                };
            });

            function dragStart(e) {
                $dragging = true;
                clientX = e.clientX;
                clientY = e.clientY;
                if (e.touches) {
                    clientX = e.touches[0].clientX
                    clientY = e.touches[0].clientY
                }
                x = clientX - self.model.x;
                y = clientY - self.model.y;
            }
        }
        /**
         * Register the zoom control events
         */
        function registerZoomEvents() {
            self.zoomControl.setAttribute('min', self.options.zoom.minValue)
            self.zoomControl.setAttribute('max', self.options.zoom.maxValue)
            self.zoomControl.setAttribute('step', self.options.zoom.step)
            self.zoomControl.value = self.options.zoom.initialValue
            self.zoomControl.addEventListener('input', zoomChange);

            function zoomChange(e) {
                self.model.zoom = Number(this.value);
                updateZoomIndicator();
                scaleImage();
                /**
                 * Call the onPositionChange callback
                 */
                if (typeof self.options.onZoomChange === 'function') {
                    self.options.onZoomChange(self.model);
                }
            }
        }
        /**
         * Set the image to the center of the frame
         */
        function centerImage() {
            var x = Math.abs(self.model.x - ((self.model.width - self.model.cropWidth) / 2));
            var y = Math.abs(self.model.y - ((self.model.height - self.model.cropHeight) / 2));
            x = self.model.x - x;
            y = self.model.y - y;
            x = Math.min(x, 0);
            y = Math.min(y, 0);

            if (self.model.width + (x) < self.model.cropWidth) {
                /**
                 * Calculates to handle the empty space on the right side
                 */
                x = Math.abs((self.model.width - self.model.cropWidth)) * -1;
            }
            if (self.model.height + (y) < self.model.cropHeight) {
                /**
                 * Calculates to handle the empty space on bottom
                 */
                y = Math.abs((self.model.height - self.model.cropHeight)) * -1;
            }
            self.model.x = x;
            self.model.y = y;
        }
        /**
         * Calculates the new image's position based in its new size
         */
        function getPosition(newWidth, newHeight) {

            var deltaY = (self.model.y - (self.model.cropHeight / 2)) / self.model.height;
            var deltaX = (self.model.x - (self.model.cropWidth / 2)) / self.model.width;
            var y = (deltaY * newHeight + (self.model.cropHeight / 2));
            var x = (deltaX * newWidth + (self.model.cropWidth / 2));

            x = Math.min(x, 0);
            y = Math.min(y, 0);

            if (newWidth + (x) < self.model.cropWidth) {
                /**
                 * Calculates to handle the empty space on the right side
                 */
                x = Math.abs((newWidth - self.model.cropWidth)) * -1;

            }
            if (newHeight + (y) < self.model.cropHeight) {
                /**
                 * Calculates to handle the empty space on bottom
                 */
                y = Math.abs((newHeight - self.model.cropHeight)) * -1;
            }
            return { x: x, y: y };
        }
        /**
         * Resize the image
         */
        function scaleImage() {
            /**
             * Calculates the image position to keep it centered
             */
            var newWidth = self.model.originalWidth * self.model.zoom;
            var newHeight = self.model.originalHeight * self.model.zoom;

            var position = getPosition(newWidth, newHeight);

            /**
             * Set the model
             */
            self.model.width = newWidth;
            self.model.height = newHeight;
            self.model.x = position.x;
            self.model.y = position.y;
            updateZoomIndicator();
            render();

            /**
             * Call the onImageSizeChange callback
             */
            if (typeof self.options.onImageSizeChange === 'function') {
                self.options.onImageSizeChange(self.model);
            }
        }

        /**
         * Updates the icon state from the slider
         */
        function updateZoomIndicator() {
            /**
             * Updates the zoom icon state
             */
            if (self.model.zoom.toFixed(2) == Number(self.zoomControl.getAttribute('min')).toFixed(2)) {
                self.zoomControl.classList.add('zoom--minValue');
            } else {
                self.zoomControl.classList.remove('zoom--minValue');
            }
            if (self.model.zoom.toFixed(2) == Number(self.zoomControl.getAttribute('max')).toFixed(2)) {
                self.zoomControl.classList.add('zoom--maxValue');
            } else {
                self.zoomControl.classList.remove('zoom--maxValue');
            }
        }

        /**
         * Resize and position the image to fit into the frame
         */
        function fitToFrame() {
            var newHeight, newWidth, scaleRatio;

            var frameRatio = self.model.cropHeight / self.model.cropWidth;
            var imageRatio = self.model.height / self.model.width;

            if (frameRatio > imageRatio) {
                newHeight = self.model.cropHeight;
                scaleRatio = (newHeight / self.model.height);
                newWidth = parseFloat(self.model.width) * scaleRatio;
            } else {
                newWidth = self.model.cropWidth;
                scaleRatio = (newWidth / self.model.width);
                newHeight = parseFloat(self.model.height) * scaleRatio;
            }
            self.model.zoom = scaleRatio;

            self.zoomControl.setAttribute('min', scaleRatio);
            self.zoomControl.setAttribute('max', self.options.zoom.maxValue - scaleRatio);
            self.zoomControl.value = scaleRatio;

            self.model.height = newHeight;
            self.model.width = newWidth;
            updateZoomIndicator();
            centerImage();
        }
        /**
         * Update image's position and size
         */
        function render() {
            self.canvasContext.clearRect(0, 0, self.model.cropWidth, self.model.cropHeight);
            self.canvasContext.save();
            self.canvasContext.globalCompositeOperation = "destination-over";
            self.canvasContext.drawImage(self.model.imageSrc, self.model.x, self.model.y, self.model.width, self.model.height);
            self.canvasContext.restore();

            if (self.options.imageHelper) {
                updateHelper();
            }
            /**
             * Call the onChange callback
             */
            if (typeof self.options.onChange === 'function') {
                self.options.onChange(self.model);
            }
        }

        /**
         * Updates the image helper attributes
         */
        function updateHelper() {
            var x = self.model.x + self.photoFrame.offsetLeft;
            var y = self.model.y + self.photoFrame.offsetTop;
            /**
             * Clear
             */
            self.imageHelperCanvasContext.clearRect(0, 0, self.imageHelperCanvas.width, self.imageHelperCanvas.height);
            self.imageHelperCanvasContext.save();
            self.imageHelperCanvasContext.globalCompositeOperation = "destination-over";
            /**
             * Draw the helper
             */
            self.imageHelperCanvasContext.beginPath();
            self.imageHelperCanvasContext.rect(0,0,self.imageHelperCanvas.width, self.imageHelperCanvas.height);
            self.imageHelperCanvasContext.fillStyle = self.options.imageHelperColor;
            self.imageHelperCanvasContext.fill('evenodd');
            /**
             * Draw the image
             */
            self.imageHelperCanvasContext.drawImage(self.model.imageSrc, x, y, self.model.width, self.model.height);
            self.imageHelperCanvasContext.restore();
        }
        /**
         * Creates the canvas for the image helper
         */
        function registerImageHelper() {
            var canvas = document.createElement('canvas');
            canvas.className = "canvas--helper";
            canvas.width = self.photoHelper.offsetWidth;
            canvas.height = self.photoHelper.offsetHeight;

            self.photoHelper.prepend(canvas);

            self.imageHelperCanvas = canvas;
            self.imageHelperCanvasContext = canvas.getContext('2d');
            self.imageHelperCanvasContext.mozImageSmoothingEnabled = false;
            self.imageHelperCanvasContext.msImageSmoothingEnabled = false;
            self.imageHelperCanvasContext.imageSmoothingEnabled = false;
        }
        /**
         * Return the image cropped as Base64 data URL
         */
        function getAsDataURL(quality) {
            if (!quality) { quality = 0.8; }
            return self.canvas.toDataURL('image/jpeg', quality);
        }

        function addEventListeners(element, events, fn, child) {
          var callback = fn
          if (child){
            callback = function(event){
              var clickedElement = event.target, matchingChild = clickedElement.closest(child)
              if (matchingChild) fn(matchingChild)
            }
          }
          events.split(' ').forEach(function(e){
            element.addEventListener(e, callback)
          });
        }
    }
})(window);
