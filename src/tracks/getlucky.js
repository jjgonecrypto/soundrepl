(function(soundrepl, teoria) {
  'use strict';

  var getlucky = {};

  var rhythms = {
    bass1: [1, 0.75, 0.25, 1, 1],
    bass2: [1, 0.75, 0.25, 1, 0.5, 0.5],
    main1: [0.5, 0.5, 0.75, 0.75, 0.5, 0.5, 0.5],
    main2: [0.5, 0.5, 0.75, 0.5, 0.75, 0.5, 0.5]
  };

  var bassLines = {
    B: ['b2', 'b3', 'b2', 'b2', 'b3'],
    D: ['d2', 'd3', 'd2', 'd2', 'd3'],
    'F#': ['f#2', 'f#3', 'f#2', 'f#2', 'f#3'],
    E: ['e2', 'e3', 'e2', 'e2', 'e3']
  };

  var chords = {
    B: ['b4', 'd4', 'f#4'],
    B7: ['a4', 'b4', 'd4', 'f#4'],
    DlowA: ['a4', 'd4', 'f#4'],
    D: ['d4', 'f#4', 'a5'],
    'F#lowC#': ['c#4', 'f#4', 'a5'],
    'F#': ['f#4', 'a5', 'c#5'],
    'F#7': ['e4', 'f#4', 'a5', 'c#5'],
    AlowE: ['e4', 'a5', 'c#5'],
    A: ['a5', 'c#5', 'e5'],
    E: ['e4', 'g#4', 'b5'],
    ES: ['e4', 'g#4'],
    DS: ['d4', 'f#4'],
    'C#S': ['c#4', 'e4']
  }

  var progressions = {
    B: [chords.B, chords.B, chords.B, chords.B, chords.B, chords.DlowA, chords.B],
    B7: [chords.B7, chords.B7, chords.B7, chords.B7, chords.B7, chords.B7, chords.B7],
    D: [chords.D, chords.D, chords.D, chords.D, chords.D, chords['F#lowC#'], chords.D],
    E: [chords.E, chords.E, chords.E, chords.E, chords.E, chords.E, chords.E],
    'F#': [chords['F#'], chords['F#'], chords['F#'], chords['F#'], chords['F#'], chords.AlowE, chords['F#']],
    'F#7': [chords['F#7'], chords['F#7'], chords['F#7'], chords['F#7'], chords['F#7'], chords['F#7'], chords['F#7']],
    Edesc: [chords.E, chords.E, chords.E, chords.E, chords.ES, chords.DS, chords['C#S']]
  };

  var getlucky = soundrepl.create();
  getlucky.add(rhythms.bass1, 'bass line rhythm 1');
  getlucky.add(bassLines.E, 'bass line in E');

  getlucky.add(bassLines.B.concat(bassLines.D, bassLines['F#'], bassLines.E), 'B-D-F#-E bassline').map(rhythms.bass1).sawtooth();
  getlucky.add(progressions.B.concat(progressions.D, progressions['F#'], progressions.Edesc), 'B-D-F#-E riff').map(rhythms.main1);
  getlucky.add(progressions.B7.concat(progressions.D, progressions['F#7'], progressions.E), 'B7-D-F#7-E riff').map(rhythms.main2);
    

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) exports = module.exports = getlucky;
    exports.getlucky = getlucky;
  } 
  else if (typeof this !== 'undefined') this.getlucky = getlucky;
  else if (typeof window !== 'undefined') window.getlucky = getlucky;

  return getlucky;
})(window.soundrepl, window.teoria);