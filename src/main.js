(function(teoria) { 
  'use strict';

  var SoundRepl = function () {
    this.entries = {};
  };

  SoundRepl.prototype.add = function (entry, name) {
    this.entries[name] = new SoundReplEntry(entry);
    return this.entries[name];
  };

  var SoundReplEntry = function (entry) {
    this.entry = entry;
  };

  SoundReplEntry.prototype.map = function (toType) {
    this.entry = (Array.isArray(this.entry)) ? this.entry : [this.entry];
    this.entry.forEach(function (value, i) {
      var descriptor;
      var mapIndex = (i >= toType.length) ? i % toType.length : i;
      if (typeof value === 'string' && typeof toType[mapIndex] === 'number') 
        descriptor = {notes: [value], duration: toType[mapIndex]};
      else if (typeof value === 'number' && typeof toType[mapIndex] === 'string')
        descriptor = {notes: toType[mapIndex], duration: value};
      else if (Array.isArray(value) && typeof toType[mapIndex] === 'number')
        descriptor = {notes: value, duration: toType[mapIndex]};
      else
        return;
      this.entry[i] = descriptor;
    }, this);
    return this;
  };

  SoundReplEntry.prototype.play = function (ac) {
    
    function createFromNote(note) {
      var o = ac.createOscillator();
      o.frequency.value = teoria.note(note).fq();
      return o;
    }

    function createFromSound(sound) {
      var player = {
        oscillators: [],
        duration: 1 //default
      };
      if (typeof sound === 'string') //note
        player.oscillators.push(createFromNote(sound));
      else if (typeof sound === 'number') //duration
        player.oscillators.push(createFromNote('a4'));
      else if (Array.isArray(sound)) //[note] => chord
        sound.forEach(function (note) {
          player.oscillators.push(createFromNote(note));
        });
      else if (typeof sound === 'object') { //[note] + duration
        sound.notes = (Array.isArray(sound.notes)) ? sound.notes : [sound.notes];
        sound.notes.forEach(function(note) {
          player.oscillators.push(createFromNote(note));
        });
        player.duration = sound.duration;
      }
      return player;
    }
    var start = 0;

    var values = (Array.isArray(this.entry)) ? this.entry : [this.entry]; //entry can be progression or single note / duration
    
    var playEntries = values.map(function(sound) {
      return createFromSound(sound);
    });
    
    playEntries.forEach(function (p) {
      p.oscillators.forEach(function (osc) { //handle notes / chords with one oscillator each
        osc.connect(ac.destination);
        osc.start(start + ac.currentTime);
        setTimeout(function() {osc.stop(0); osc.disconnect();}, (start+p.duration)*1000);
      });
      
      start += p.duration;
    });

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