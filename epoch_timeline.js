
const EPOCH_DEBUG = true;
function elog(str) {
  if (EPOCH_DEBUG)
    console.log(str);
}

function EpochTimeline (aOptions) {
  this.init(aOptions)
}

EpochTimeline.prototype = {

  // Internal variables
  _isInitialized: false,
  _title: null,
  _elem: null,
  _events: [],
  _interval: 500,
  _autorun: true,
  _isRunning: false,


  // init
  init: function(aOptions) {
    elog("init");
    // Prevent duplicate initialization
    if (this._isInitialized)
      throw new Error("Already initialized");
    // Make sure we have the right options
    if (!aOptions)
      throw new Error("No options provided");
    if (!aOptions.events)
      throw new Error("Cannot create timeline without events");

    // find element
    this._initElem(aOptions.id);
    if (!this._elem)
      throw new Error("Cannot create timeline without a DOM element");

    // parse out other options
    this.setInterval(aOptions.interval);
    if (typeof(aOptions.autorun) == "boolean")
      this._autorun = aOptions.autorun;

    if (this._autorun)
      this.play();
  },

  update: function(self) {
    if (!self._isRunning)
      return;

    var now = new Date();
    elog("[" + now + "] updating...");

    setTimeout(function() { self.update(self); }, self._interval);
  },

  play: function() {
    if (!this._isRunning) {
      this._isRunning = true;
      this.update(this);
    }
  },

  pause: function() {
    this._isRunning = false;
  },

  setInterval: function(aInterval) {
    if (aInterval && typeof(aInterval) == "number")
      this._interval = aInterval;
  },

  _initElem: function (aId) {
    if (!aId) return;
    this._elem = document.getElementById(aId);
  },

  _parseEvents: function(aEvents) {
  }

}

function EpochTimelineEvent(aOptions) {}

EpochTimelineEvent.prototype = {}

