(function(teoria, setTimeout) { 
  'use strict';

  var SINE = 0;
  var SQUARE = 1;
  var SAWTOOTH = 2;
  var TRIANGLE = 3;
  var ac; //a static reference to the audio context

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

  SoundRepl.prototype.create = function (content) {
    return new SoundReplEntry(content);
  };

  SoundRepl.prototype.setAudioContext = function (audioContext) {
    ac = audioContext; //not beautiful.
  };

  var SoundReplEntry = function (entry) {
    this.entry = entry;
    this.waveType = SINE;
  };

  function createFromNote(note, type) {
    var o = ac.createOscillator();
    type = (typeof type === 'number') ? type : SINE;
    o.type = type;
    try {
      o.frequency.value = teoria.chord(note).fq(); //try chord 
    } catch (err) {
      o.frequency.value = teoria.note(note).fq(); //otherwise note
    }
    
    return o;
  }

  function isChord(string) {
    //prevent X3, X5, X6 an X7 from resolving as chords
    if (string.slice(-1) === "3" || string.slice(-1) === "5" || string.slice(-1) === "6" || string.slice(-1) === "7") return false;   
    try {
      teoria.chord(string); //try chord
      return true; 
    } catch (err) { return false; }
  }

  function arrayOfNotes(chord) {
    return teoria.chord(chord).notes().map(function(n) { return n.toString(); });
  }

  function createFromSound(sound, type) {
    var player = {
      oscillators: [],
      duration: 1 //default
    };
    if (typeof sound === 'string' && sound.length > 0) { //note, chord or rest
      if (isChord(sound)) return createFromSound(arrayOfNotes(sound), type);
      player.oscillators.push(createFromNote(sound, type));
    } else if (typeof sound === 'number') { //duration
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
        if (isChord(value)) descriptor = {notes: arrayOfNotes(value), duration: toType[mapIndex]};
        else descriptor = {notes: [value], duration: toType[mapIndex]};
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
    return this;
  };

  SoundReplEntry.prototype.transpose = function (interval) {
    function transposeNote (string) {
      return teoria.note(string).transpose(interval).toString();
    }
    function transposeChord (string) {
      return teoria.chord(string).transpose(interval).notes().map(function (n) { return n.toString(); });
    }

    this.entry = arrayWrap(this.entry);
    this.entry.forEach(function (value, i) {
      if (typeof value === 'string')
        if (isChord(value)) this.entry[i] = {notes: transposeChord(value)};
        else this.entry[i] = {notes: [transposeNote(value)]};
      else if (Array.isArray(value))
         this.entry[i] = {notes: value.map(function (a) { return transposeNote(a); })};
      else if (typeof value === 'object' && 'notes' in value) {
        var notes = arrayWrap(value.notes);
        value.notes = notes.map(function (a) { return transposeNote(a); }); 
      }

    }, this);
    return this;
  };

  SoundReplEntry.prototype.sine = function () {
    this.waveType = SINE;
    return this;
  };

  SoundReplEntry.prototype.square = function () {
    this.waveType = SQUARE;
    return this;
  };

  SoundReplEntry.prototype.sawtooth = function () {
    this.waveType = SAWTOOTH;
    return this;
  };

  SoundReplEntry.prototype.triangle = function () {
    this.waveType = TRIANGLE;
    return this;
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

  SoundReplEntry.prototype.repeat = function (count) {
    this.repeat = count;
    return this;
  };

  SoundReplEntry.prototype.stop = function () { 
    delete this.repeat;
    return this;
  };

  SoundReplEntry.prototype.play = function (bpm) {
    var self = this;
    var start = 0;
    bpm = (typeof bpm === 'number') ? bpm : 120;
    var beatLength = 60 / bpm;
    var values = (Array.isArray(this.entry)) ? this.entry : [this.entry]; //entry can be progression or single note / duration
    var playEntries = values.map(function(sound) {
      return createFromSound(sound, this.waveType);
    }, this);
    playEntries.forEach(function (p, i) {
      var duration = p.duration * beatLength;
      p.oscillators.forEach(function (osc) { //handle notes / chords with one oscillator each
        osc.connect(ac.destination);
        osc.start(start + ac.currentTime);
        setTimeout(function(i) {
          osc.stop(0); osc.disconnect();
          if (typeof self.repeat !== 'number') return; //ensure repeat is set to continue
          else if (i != playEntries.length - 1) return; //ensure last run only
          else if (self.repeat > 1) self.repeat--;
          else if (self.repeat === 1) delete self.repeat; 
          self.play(bpm);
        }, (start+duration)*1000, i);
      });
      
      start += duration;
    });

    return this;
  };

  var soundrepl = {
    init: function (audioContext) {
      var instance = new SoundRepl();
      ac = audioContext;
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
})(window.teoria, window.setTimeout);