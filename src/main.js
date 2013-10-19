(function(teoria) { 
  'use strict';

  var SINE = 0;
  var SQUARE = 1;
  var SAWTOOTH = 2;
  var TRIANGLE = 3;

  function arrayWrap(value) {
    return (Array.isArray(value)) ? value : [value];
  }

  var SoundRepl = function () {
    this.entries = {};
  };

  SoundRepl.prototype.add = function (entry, name) {
    this.entries[name] = new SoundReplEntry(entry);
    return this.entries[name];
  };

  var SoundReplEntry = function (entry) {
    this.entry = entry;
    this.waveType = SINE;
  };

  function createFromNote(note, type) {
    var o = ac.createOscillator();
    type = (typeof type === 'number') ? type : SINE;
    o.type = type;
    o.frequency.value = teoria.note(note).fq();
    return o;
  }

  function createFromSound(sound, type) {
    var player = {
      oscillators: [],
      duration: 1 //default
    };
    if (typeof sound === 'string' && sound.length > 0) //note
      player.oscillators.push(createFromNote(sound, type));
    else if (typeof sound === 'number') { //duration
      player.oscillators.push(createFromNote('a4', type));
      player.duration = sound;
    } else if (Array.isArray(sound)) //[note] => chord
      sound.forEach(function (note) {
        if (note.length < 1) return; //allow rests
        player.oscillators.push(createFromNote(note, type));
      });
    else if (typeof sound === 'object') { //[note] + duration
      sound.notes = (Array.isArray(sound.notes)) ? sound.notes : (sound.notes) ? [sound.notes] : [];
      sound.notes.forEach(function(note) {
        if (note.length < 1) return; //allow rests
        player.oscillators.push(createFromNote(note, type));
      });
      player.duration = (typeof sound.duration === 'number') ? sound.duration : player.duration;
    }
    return player;
  }

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

  SoundReplEntry.prototype.concat = function (entry) {
    this.entry = [].concat(this.entry, entry);
  }

  SoundReplEntry.prototype.transpose = function (interval) {
    function transpose (note) {
      return teoria.note(note).transpose(interval).toString();
    }

    this.entry = arrayWrap(this.entry);
    this.entry.forEach(function (value, i) {
      if (typeof value === 'string')
         this.entry[i] = {notes: [transpose(value)]};
      else if (Array.isArray(value))
         this.entry[i] = {notes: value.map(function (a) { return transpose(a); })};
      else if (typeof value === 'object' && 'notes' in value) {
        var notes = arrayWrap(value.notes);
        value.notes = notes.map(function (a) { return transpose(a); }); 
      }

    }, this);
    return this;
  };

  SoundReplEntry.prototype.sine = function () {
    this.waveType = SINE;
  };

  SoundReplEntry.prototype.square = function () {
    this.waveType = SQUARE;
  };

  SoundReplEntry.prototype.sawtooth = function () {
    this.waveType = SAWTOOTH;
  };

  SoundReplEntry.prototype.triangle = function () {
    this.waveType = TRIANGLE;
  };

  SoundReplEntry.prototype.length = function () {
    var values = (Array.isArray(this.entry)) ? this.entry : [this.entry]; //entry can be progression or single note / duration
    var total = 0;
    values.map(function(sound) {
      return createFromSound(sound);
    }).forEach(function (p) {
      total += p.duration;
    });
    return total;
  };

  SoundReplEntry.prototype.play = function (ac, bpm) {
    var start = 0;
    bpm = (typeof bpm === 'number') ? bpm : 120;
    var beatLength = 60 / bpm;
    var values = (Array.isArray(this.entry)) ? this.entry : [this.entry]; //entry can be progression or single note / duration
    var playEntries = values.map(function(sound) {
      return createFromSound(sound, this.waveType);
    }, this);
    playEntries.forEach(function (p) {
      var duration = p.duration * beatLength;
      p.oscillators.forEach(function (osc) { //handle notes / chords with one oscillator each
        osc.connect(ac.destination);
        osc.start(start + ac.currentTime);
        setTimeout(function() {osc.stop(0); osc.disconnect();}, (start+duration)*1000);
      });
      
      start += duration;
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