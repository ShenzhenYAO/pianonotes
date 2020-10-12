document.addEventListener("DOMContentLoaded", () => {

  createSmallPiano();

  let pianoSynth = Synth.createInstrument('piano');

  pianoSynth.play('C', 3, 3);

  function createSmallPiano() {
    // Using notes and octaves data
    const startNote = {
      note: "a",
      octave: 0
    };
    const endNote = {
      note: "c",
      octave: 8
    };

    let piano;
    try {
      piano = newPiano(startNote, endNote);
    } catch (e) {
      if (e instanceof PianoBuildError) {
        console.log("Error building piano", e);
      } else {
        throw e;
      }
    } 

    piano.keyDown = (key) => {
      const keyNumber = piano.keyNumber(key);
      const keyNote = piano.keyNote(key);
      const keyOctave = piano.keyOctave(key);

      console.log("key number", keyNumber) 
      console.log("note", keyNote);
      console.log("octave", keyOctave);

      let letterNumber = (keyNumber % 12);
      letterNumber = letterNumber == 0 ? 12 : letterNumber;
      const letter = letterForKey(letterNumber);
      const seconds = 2;
      const section = Math.ceil(keyNumber/12)+3;

      console.log(letter, section, seconds)
      pianoSynth.play(letter, section, seconds);
    }

    document.body.appendChild(piano.HTML);
    window.piano2 = piano;
  }

  function letterForKey(key) {
    switch (key) {
      case 1:
        return "C";
      case 2:
        return "C#";
      case 3:
        return "D";
      case 4:
        return "D#";
      case 5:
        return "E";
      case 6:
        return "F";
      case 7:
        return "F#";
      case 8:
        return "G"
      case 9:
        return "G#";
      case 10:
        return "A";
      case 11:
        return "A#";
      case 12:
        return "B";
    }
  }
});


