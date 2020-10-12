"use strict"

var lnotedivs = [], tmpdiv = undefined;
var rnotedivs = [];
var allnotes = datastr_to_stdobj(notesStr);
;
console.log(allnotes)

const synth = new Tone.PolySynth(Tone.Synth).toDestination();
Tone.context.resume().then(() => {
    Tone.start()
    // synth.triggerAttackRelease("E4", "4n");
// synth.triggerAttackRelease("C5", "6n");
// synth.triggerAttackRelease("A4", "8n");
// synth.triggerAttackRelease("D5", "8n");
// synth.triggerAttackRelease("C5", "8n");
// synth.triggerAttackRelease("B7", "8n");
// synth.triggerAttackRelease("C5", "4n");
// synth.triggerAttackRelease("A4", "4n");
Tone.context.resume()
  });

// // the following crap is about Tone.js. It sucks
// const synth = new Tone.PolySynth(Tone.Synth).toDestination();

// // //create a synth and connect it to the main output (your speakers)
// // const synth = new Tone.Synth().toDestination();
// // const now = Tone.now();
// // synth.context.resume();

// Tone.start().then(d=>{
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
// });



(async () => {

    await makeInputDoms()
    await makeBigDivs()
    await start()

    await buildPianoWrappers()

    // // build the initinal piano
    await buildPianoKeys()

    //https://www.geeksforgeeks.org/how-to-detect-the-change-in-divs-dimension/
    let resizeObserver = new ResizeObserver(async function () { // requires jquery
        // console.log("The element was resized");
        //remove the existing pianog
        d3.selectAll('g.whitekeyg').remove()
        d3.selectAll('g.blackkeyg').remove()
        await buildPianoKeys() // the piano is resized as the wrapper size changes
    });
    resizeObserver.observe(d3.select('div#pianodiv').node());


    //play a middle 'C' for the duration of an 8th note
    // trigger the attack immediately
// synth.triggerAttack("C4", now)
// // wait one second before triggering the release
// synth.triggerRelease(now + 1)  

})()





