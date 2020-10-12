"use strict"

var lnotedivs = [], tmpdiv = undefined;
var rnotedivs = [];
var allnotes = datastr_to_stdobj(notesStr);
;
console.log(allnotes)
//https://tonejs.github.io/
const synth = new Tone.PolySynth(Tone.Synth).toDestination();




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





