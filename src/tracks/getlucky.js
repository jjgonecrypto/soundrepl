(function(soundrepl, setTimeout) {
  'use strict';

  var rhythms = {
    bass1: [1, 0.75, 0.25, 1, 1],
    bass2: [1, 0.75, 0.25, 1, 0.5, 0.5],
    main1: [0.5, 0.5, 0.75, 0.75, 0.5, 0.5, 0.5],
    main2: [0.5, 0.5, 0.75, 0.5, 0.75, 0.5, 0.5],
    vocal1: [1, 0.5, 0.5, 0.5, 0.25, 0.5, 0.25, 1, 0.5, 3],
    cv1: [0.5, 0.25, 0.5, 0.5, 0.5, 0.25, 0.5, 1],
    cv2: [0.5, 0.25, 0.5, 0.5, 0.5, 0.25, 0.5, 0.5, 0.5]
  };

  var bassLines = {
    B: ['b0', 'b1', 'b0', 'b0', 'b1'],
    D: ['d1', 'd2', 'd1', 'd1', 'd2'],
    'F#': ['f#1', 'f#2', 'f#1', 'f#1', 'f#2'],
    E: ['e1', 'e2', 'e1', 'e1', 'e2']
  };

  var chords = {
    B: ['b3', 'd4', 'f#4'],
    B7: ['a3', 'b3', 'd4', 'f#4'],
    DlowA: ['a3', 'd4', 'f#4'],
    D: ['d4', 'f#4', 'a4'],
    'F#lowC#': ['c#4', 'f#4', 'a4'],
    'F#': ['f#4', 'a4', 'c#5'],
    'F#7': ['e4', 'f#4', 'a4', 'c#5'],
    AlowE: ['e4', 'a4', 'c#5'],
    A: ['a4', 'c#5', 'e5'],
    E: ['e4', 'g#4', 'b4'],
    ES: ['e4', 'g#4'],
    DS: ['d4', 'f#4'],
    'C#S': ['c#4', 'e4']
  };

  var progressions = {
    B: [chords.B, chords.B, chords.B, chords.B, chords.B, chords.DlowA, chords.B],
    B7: [chords.B7, chords.B7, chords.B7, chords.B7, chords.B7, chords.B7, chords.B7],
    D: [chords.D, chords.D, chords.D, chords.D, chords.D, chords['F#lowC#'], chords.D],
    E: [chords.E, chords.E, chords.E, chords.E, chords.E, chords.E, chords.E],
    'F#': [chords['F#'], chords['F#'], chords['F#'], chords['F#'], chords['F#'], chords.AlowE, chords['F#']],
    'F#7': [chords['F#7'], chords['F#7'], chords['F#7'], chords['F#7'], chords['F#7'], chords['F#7'], chords['F#7']],
    Edesc: [chords.E, chords.E, chords.E, chords.E, chords.ES, chords.DS, chords['C#S']],
    chorusD: ['', 'd5', 'd5', 'd5', 'd5', 'd5', 'd5', 'e5'],
    'chorusC#': ['', 'c#5', 'c#5', 'c#5', 'c#5', 'c#5', 'c#5', 'e5']
    
  };

  var melodies = {
    vp1: 
      [
        { duration: 1 }, 
        { duration: 0.5, notes: 'e4'}, 
        { duration: 0.5, notes: 'e4'}, 
        { duration: 0.5, notes: 'b4'}, 
        { duration: 0.25, notes: 'a4'}, 
        { duration: 0.5, notes: 'g#4'}, 
        { duration: 0.25, notes: 'a4'}, 
        { duration: 1, notes: 'a4'}, 
        { duration: 0.5, notes: 'f#4'}, 
        { duration: 3 }
      ],
    vp2:
      [
        { duration: 1.5 },
        { duration: 0.5, notes: 'f#4'},
        { duration: 0.75, notes: 'b4'},
        { duration: 0.5, notes: 'g#4'},
        { duration: 0.25, notes: 'a4'},
        { duration: 1, notes: 'a4'},
        { duration: 0.5, notes: 'f#4'},
        { duration: 3}
      ],
    vp3: 
      [
        { duration: 1.5 },
        { duration: 0.5, notes: 'e4' },
        { duration: 0.5, notes: 'b4' },
        { duration: 0.25, notes: 'a4' },
        { duration: 0.5, notes: 'g#4' },
        { duration: 0.5, notes: 'g#4' },
        { duration: 0.75, notes: 'g#4' },
        { duration: 0.5, notes: 'a4' },
        { duration: 3}
      ],
    vp4: 
      [
        { duration: 1.5 },
        { duration: 0.5, notes: 'f#4' },
        { duration: 0.5, notes: 'b4' },
        { duration: 0.25, notes: 'a4' },
        { duration: 0.5, notes: 'g#4' },
        { duration: 0.5, notes: 'a4' },
        { duration: 0.75, notes: 'a4' },
        { duration: 1.5, notes: 'f#4' },
        { duration: 2}
      ],
    pc: 
      [
        { duration: 2, notes: 'd5' },
        { duration: 0.5 },
        { duration: 0.5, notes: 'c#5' },
        { duration: 0.5, notes: 'd5' },
        { duration: 2.5, notes: 'f#5' },
        { duration: 0.5 },
        { duration: 0.5, notes: 'f#5' },
        { duration: 0.5, notes: 'g#5' },
        { duration: 2.5, notes: 'a5' },
        { duration: 0.5 },
        { duration: 0.5, notes: 'a5' },
        { duration: 0.5, notes: 'b5' },
        { duration: 3.5, notes: 'g#5' },
        { duration: 0.5 },
        { duration: 0.5, notes: 'b4' },
        { duration: 2, notes: 'd5' },
        { duration: 0.5}, 
        { duration: 0.5, notes: 'c#5' },
        { duration: 0.5, notes: 'd5' },
        { duration: 2.5, notes: 'f#5' },
        { duration: 0.5 },
        { duration: 0.5, notes: 'f#5' },
        { duration: 0.5, notes: 'g#5' },
        { duration: 2.5, notes: 'a5' },
        { duration: 0.5 },
        { duration: 0.5, notes: 'a5' },
        { duration: 0.5, notes: 'd6' },
        { duration: 4.5, notes: 'b5' }
      ]
    
  };

  var getlucky = soundrepl.init();
  var output = {};

  getlucky.add(rhythms.bass1, 'bass line rhythm 1');
  getlucky.add(bassLines.E, 'bass line in E');

  getlucky.add(progressions.B7.concat(progressions.D, progressions['F#7'], progressions.E), 'B7-D-F#7-E riff').map(rhythms.main2);
  output.bassX = getlucky.add(bassLines.B.concat(bassLines.D, bassLines['F#'], bassLines.E), 'B-D-F#-E bassline').map(rhythms.bass1).sawtooth();
  output.riffX = getlucky.add(progressions.B.concat(progressions.D, progressions['F#'], progressions.Edesc), 'B-D-F#-E riff').map(rhythms.main1);
  output.v1 = getlucky.add(melodies.vp1, 'V1 Phrase 1').transpose("P8");
  output.v2 = getlucky.add(melodies.vp2, 'V1 Phrase 2').transpose("P8");
  output.v3 = getlucky.add(melodies.vp3, 'V1 Phrase 3').transpose("P8");
  output.v4 = getlucky.add(melodies.vp4, 'V1 Phrase 4').transpose("P8");
  getlucky.add(melodies.pc, 'Pre Chorus').transpose("P8");
  getlucky.add(progressions.chorusD.concat(progressions.chorusD, progressions['chorusC#']), 'Chorus Melody').map(rhythms.cv1);

  //manual sequencer
  getlucky.doplay = function () {
    var bpm = 120;
    output.bassX.play(bpm).repeat(2);

    setTimeout(function() { output.riffX.play(bpm).repeat(2);}, 60/bpm*16*1000);
    setTimeout(function() { output.v1.play(bpm);}, 60/bpm*28*1000);
    setTimeout(function() { output.v2.play(bpm);}, 60/bpm*36*1000); 
    setTimeout(function() { output.v3.play(bpm);}, 60/bpm*40*1000); 
    setTimeout(function() { output.v4.play(bpm);}, 60/bpm*44*1000); 
      
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) exports = module.exports = getlucky;
    exports.getlucky = getlucky;
  } 
  else if (typeof this !== 'undefined') this.getlucky = getlucky;
  else if (typeof window !== 'undefined') window.getlucky = getlucky;

  return getlucky;
})(window.soundrepl, window.setTimeout);