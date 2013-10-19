(function(teoria) { 
  'use strict';

  var SoundRepl = function () {
    this.entries = {};
  };

  SoundRepl.prototype.add = function (entry, name) {
    this.entries[name] = new SoundReplEntry(entry);
    return this;
  };

  var SoundReplEntry = function (entry) {
    this.entry = entry;
  };
  
  SoundReplEntry.prototype.map = function (toType) {
   // if (toType)

    return this;
  };

  var soundrepl = {
    create: function () {
      var instance = new SoundRepl;
      return instance;
    }
  };

  

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) exports = module.exports = soundrepl;
    exports.soundrepl = soundrepl;
  } 
  else if (typeof this !== 'undefined') this.soundrepl = soundrepl;
  else if (typeof window !== 'undefined') window.soundrepl = soundrepl;

  return soundrepl;
})(window.teoria);