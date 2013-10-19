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
    E: ['e2', 'e3', 'e2', 'e2', 'e3'],
    G: ['g2', 'g3', 'g2', 'g2', 'g3']
  };

  var chords = {
    B: ['b4', 'd4', 'f#4'],
    F: ['c#4', 'f#4', 'a5']
  };

  var progressions = {
    basic: [{notes: ['e2'], duration: 1}, {notes: ['e4'], duration: 0.75}, {notes: ['e2'], duration: 0.25}, {notes: ['e2'], duration: 1}, {notes: ['e3'], duration: 1}]
  };

  var riffs = {
     main: [chords.B, chords.F],
   //   bassE: getlucky.bassLines.E.beat(getlucky.rhythms.bass1)
  };

  var getlucky = soundrepl.create();
  //getlucky.add(baseLines.E, 'baseline:E').map(rhythms.bass1);
  getlucky.add(rhythms.bass1, 'bass line rhythm 1');
  getlucky.add(bassLines.E, 'bass line in E');
  getlucky.add([chords.B, chords.F], 'B/F progression');
  getlucky.add(progressions.basic, 'basic bass progression');
  getlucky.add(['b3','d2'], 'double');
  getlucky.add(['a5'], 'single');
  
  // var getlucky = {
  //   rhythms: rhythms,
  //   bass: bassLines,
  //   chords: chords,
  //   riffs: riffs
  // };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) exports = module.exports = getlucky;
    exports.getlucky = getlucky;
  } 
  else if (typeof this !== 'undefined') this.getlucky = getlucky;
  else if (typeof window !== 'undefined') window.getlucky = getlucky;

  return getlucky;
})(window.soundrepl, window.teoria);