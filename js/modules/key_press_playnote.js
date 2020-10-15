
// https://stackoverflow.com/questions/50281568/audiocontext-not-allowed-to-start-in-tonejs-chrome
// https://tonejs.github.io/
// the key is to wait until resumed (Tone.context.resume())
async function onKeyPress(ev) {

    let toneletter, octaveN;
    let semi = "", seconds = 1;

    // console.log(ev)
    ev.preventDefault()
    ev.stopPropagation()

    let id = ev.target.id
    let tonestr = id.substr(4, id.length)
    // console.log(id, tonestr.length)
    if (tonestr.length === 2) {
        toneletter = tonestr.substr(0, 1)
        octaveN = tonestr.substr(1, 1)
    }
    if (tonestr.length > 2) {
        toneletter = tonestr.substr(0, 1)
        semitoneletter = tonestr.substr(1, 1)
        if (semitoneletter === 's') { semi = '#' }
        octaveN = tonestr.substr(2, 1)
    }
    var key = toneletter + semi
    console.log('play sound', key, octaveN, seconds)

    await playnote(toneletter, semi, octaveN, seconds)

} //onKeyPress


// // the following crap is about Tone.js. It sucks
// const synth = new Tone.PolySynth(Tone.Synth).toDestination();

// // //create a synth and connect it to the main output (your speakers)
// // const synth = new Tone.Synth().toDestination();
// // const now = Tone.now();


//     // const synth = new Tone.PolySynth(Tone.Synth).toDestination();
//     // const now = Tone.now();
//     // synth.triggerAttack("D4", now);
// //     // synth.triggerAttack("F4", now + 0.5);
// //     // synth.triggerAttack("A4", now + 1);
// //     // synth.triggerAttack("C5", now + 1.5);
// //     // synth.triggerAttack("E5", now + 2);
// //     // synth.triggerRelease(["D4", "F4", "A4", "C5", "E5"], now + 4);
//     // synth.triggerRelease(now+1)
//     // synth.triggerAttackRelease("C#4", "8n");
//     // synth.context.resume()        
