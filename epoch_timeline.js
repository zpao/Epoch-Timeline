
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

    // find element
    this._initElem(aOptions.id);
    if (!this._elem)
      throw new Error("Cannot create timeline without a DOM element");

    // handle events
    this._initEvents(aOptions.events);
    if (!this._events.length)
      throw new Error("Cannot create timeline without events");

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

    Array.forEach(self._events, function(aEvent) {
      aEvent.update();
    });

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

  _initEvents: function(aEvents) {
    if (!aEvents || !aEvents.length)
      return;

    var self = this;

    Array.forEach(aEvents, function(aEvent) {
      // Create a <div> for the event
      var elem = document.createElement("div");
      self._elem.appendChild(elem);
      self._events.push(new EpochTimelineEvent(elem,  aEvent));
    });
  }

}




function EpochTimelineEvent(aElem, aOptions) {
  this.init(aElem, aOptions);
}

EpochTimelineEvent.prototype = {

  _title: null,
  _description: null,
  _datetime: null,
  _elem: null,

  init: function(aElem, aOptions) {
    // XXXzpao add some integrity checks in here
    this._elem = aElem;
    this._datetime = aOptions.datetime;
    this._title = aOptions.title;
    this._description = aOptions.description;
  },

  update: function() {
    var datediff = this._datediff(this._datetime, new Date());
    var htmlBits = [
      "<b>", this._title, ": ", "</b>",
      datediff.years, " years, ",
      datediff.days, " days, ",
      datediff.hours, " hours, ",
      datediff.minutes, " minutes, and ",
      datediff.seconds, " seconds ago."
   ];
    this._elem.innerHTML = htmlBits.join("");
  },

  _datediff: function(aDate1, aDate2) {
    var rv = {};
    var diff = Math.abs(aDate2 - aDate1);

    rv.raw_milliseconds = diff;
    rv.total_milliseconds = diff;
    rv.milliseconds = diff % 1000;

    rv.raw_seconds = diff / 1000;
    rv.total_seconds = Math.floor(rv.raw_seconds);
    rv.seconds = Math.floor(rv.raw_seconds % 60);

    rv.raw_minutes = diff / (1000 * 60);
    rv.total_minutes = Math.floor(rv.raw_minutes);
    rv.minutes = Math.floor(rv.raw_minutes % 60);

    rv.raw_hours = diff / (1000 * 60 * 60);
    rv.total_hours = Math.floor(rv.raw_hours);
    rv.hours = Math.floor(rv.raw_hours % 24);

    rv.raw_days = diff / (1000 * 60 * 60 * 24);
    rv.total_days = Math.floor(rv.raw_days);
    rv.days = Math.floor(rv.raw_days % 365);

    rv.raw_years = diff / (1000 * 60 * 60 * 24 * 365);
    rv.total_years = Math.floor(rv.raw_years);
    rv.years = rv.total_years;

    return rv;
  }
}

