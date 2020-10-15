"use strict"

var lnotedivs = [], tmpdiv = undefined;
var rnotedivs = [];
// let note_stdobj = datastr_to_stdobj(notesStr);
let note_stdobj = datastr_to_stdobj(notesStr_lb);



// console.log(note_stdobj)

var allnotes = getMusicNotes(note_stdobj);
// console.log(allnotes);

var notes;

var statusdiv =d3.select('div#statusdiv')
var astr 

//https://tonejs.github.io/
// const synth = new Tone.PolySynth(Tone.Synth).toDestination();


(async () => {

    // await makeInputDoms()
    await makeBigDivs()
    // astr='makeBigDivs() run successfully'
    // d3.select('div#statusdiv').html(astr)

    // // get value from the input box
    // let s = document.getElementById('input1')
    // // console.log(parseInt(s.value))
    // let l = document.getElementById('input2')
    // // console.log(parseInt(l.value))

    // get slices of nodes to play
    // notes = getNotesToDisplay(allnotes, parseInt(s.value), parseInt(l.value))
    notes = getNotesToDisplay(allnotes, 0, allnotes.length)
    // astr= astr + '<br/>'+'getNotesToDisplay() run successfully' + notes.length
    // d3.select('div#statusdiv').html(astr)



    await makeNoteDivs(notes)
    // astr= astr + '<br/>'+'makeNoteDivs() run successfully'
    // d3.select('div#statusdiv').html(astr)

    await buildPianoWrappers()
    // astr= astr + '<br/>'+'buildPianoWrappers() run successfully'
    // d3.select('div#statusdiv').html(astr)

    // // build the initinal piano
    await buildPianoKeys()
    // astr= astr + '<br/>'+'buildPianoKeys() run successfully'
    // d3.select('div#statusdiv').html(astr)


    // //https://www.geeksforgeeks.org/how-to-detect-the-change-in-divs-dimension/
    // let resizeObserver = new ResizeObserver(async function () { // requires jquery
    //     // console.log("The element was resized");
    //     //remove the existing pianog
    //     d3.selectAll('g.whitekeyg').remove()
    //     d3.selectAll('g.blackkeyg').remove()
    //     await buildPianoKeys() // the piano is resized as the wrapper size changes
    //     // await makeNoteDivs(notes)
        
    // });
    // resizeObserver.observe(d3.select('div#pianodiv').node());

        await test1()
//   // play a middle 'C' for the duration of an 8th note
//     // trigger the attack immediately
// synth.triggerAttack("C4", now)
// // wait one second before triggering the release
// synth.triggerRelease(now + 1)  

})()





