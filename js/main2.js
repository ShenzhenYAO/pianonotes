"use strict"

const notesData = notesStr_test

// init vex.flow
const VF = Vex.Flow;
const notespace = 120; // can adjust stave width, can enlarge, cannot shrink, weird!
const beatperquarternote = 1;
const timeSignature = '4/4'


// init notes 
var allnotes, notes;
const tempo = notesData.tempo

// for debug status
var statusdiv = d3.select('div#statusdiv'), astr

//https://tonejs.github.io/
// const synth = new Tone.PolySynth(Tone.Synth).toDestination();

(async () => {

    // make a big div for stavenotes, and piano icons
    // including a div, an svg, and a g, zoom/pan enabled
    await makeBigDivs()
    // astr='makeBigDivs() run successfully'
    // d3.select('div#statusdiv').html(astr)

    //make the 88 key paino
    await buildPianoWrappers()
    // astr= astr + '<br/>'+'buildPianoWrappers() run successfully'
    // d3.select('div#statusdiv').html(astr)
    // // build the initinal piano
    await buildPianoKeys()
    // astr= astr + '<br/>'+'buildPianoKeys() run successfully'
    // d3.select('div#statusdiv').html(astr)

    // get the standardized notes
    // 1. get a collection of notesdata by clef
    // notesdata like {notes: [{clef: 'treble, text:''}}, ]}; notesdate_clefs: [{clef: 'treble, text:''}}, ]
    let notesdate_clefs = notesData.notes
    // console.log(notesdate_clefs)

    // 2. convert to standard note data (with tone, octaveN, etc)
    let stdnotesdata_clefs = convertToStdNotes(notesdate_clefs)
    // console.log(stdnotesdata_clefs)


    //4. draw stave notes
    //4a. in the bigg, add a stavenoteg 
    d3.select('g#bigg').append('g').attrs({ 'id': 'staveg' })

    // 5. in the stevenoteg, add an svg as the renderer for VF stave notes 
    let parentID = 'staveg'
    let parentDom = d3.select('g#staveg').node()
    let staveSVG_vft = makeStaveSvg(parentDom) // by default, the svg is growing with the conents inside

    // 6. prepare the notedata for VF to draw stavenotes
    /**
     The notes of the same dataline (in the raw data) are to be added in the same vertical postion, and played at the same time
     In VF, these same-dataline notes are called stavenotes
     notespace (should be enough to insert piano icon latter)
     order number of the stave or measure
     width of the measure (depending on # of stavenotes or datalines in a measure)
     Notes, with clef, tone, duration / dataline
     ties, beam, tuplet /dataline
     */

    //prepare vf data of each note
    stdnotesdata_clefs.forEach(d => {
        d.contents.forEach(e => {
            e = makeVFNoteData(e)
        }) //d.contents forEach
    })// stdnotesdata_clefs   
    // console.log(stdnotesdata_clefs)

    // fold notes of the same line together
    let stdnotesdata_clefs_sameline = makeVFStaveNotes(stdnotesdata_clefs)
    // console.log(stdnotesdata_clefs_sameline)

    // fold stavenotes of the same measure (bar)
    let stdnotesdata_clefs_samemeasure = makeVFMeasures(stdnotesdata_clefs_sameline)
    // console.log(stdnotesdata_clefs_samemeasure)

    // need to align the staveBounds.x of each measure in differnt clefs
    // e.g., for treble and bass, the first stave may have different lenth
    // however, the second stave should start from the same postion
    // wait! also need to align the position of notes in each clef
    // hmm, should draw two staves at the same time, e.g., measure 0 of treble, and measure 0 of bass
    // That way vex flow will auto align the notes...

    // convert it as [[{measure 0, vfnotes (bass)}, {measure 0, vfnotes (teble)}], {measure 1, ...}]
    let treble = stdnotesdata_clefs_samemeasure[0].vfmeasures
    let bass = stdnotesdata_clefs_samemeasure[1].vfmeasures
    let vfmeasures1 = zip(treble, bass)

    // convert it as [{measure: 0, treble:[vfnotes1, 2 ...], bass:}]
    let vfmeasures = makeVFMeasuresByClef(vfmeasures1)
    // console.log(vfmeasures)

    // draw blank staves by clef
    let vfstaves = addBlankStavesByClef(vfmeasures, staveSVG_vft)
    // console.log(vfstaves)

    //draw stave notes by measure and by clef
    let staveNoteGroups = drawStaveNotes(staveSVG_vft, vfmeasures, vfstaves)
    // console.log(staveNoteGroups) // the result contains two clefs, each with stavenote data grouped by measures

    // the following is to link data to the individual notehead doms
    /*********************************************************************************** */


    //1. unfold the staveNoteGroups by clef down to individual note level
    let allStaveNoteData = { treble: [], bass: [] }
    allStaveNoteData.treble = makeStaveNoteArrayByClef(staveNoteGroups, 'treble')
    allStaveNoteData.bass = makeStaveNoteArrayByClef(staveNoteGroups, 'bass')
    // console.log(allStaveNoteData)


    // link data to node heads

    //The stavenote are unit of notes to be played at the same time
    // They have ids that are specified in macro makeAllStaveNotegroupsInAMeasure()
    // each stavenote has children dom g elements as note heads
    // these note heads can be link to individual data (both vf stavenote data, and original data)
    // with the linked data, we can draw piano icons, and play sound. 

    //2.  get stavenote g elements
    let vfstavenotesg = d3.selectAll('g.vf-stavenote')
    // console.log(vfstavenotesg)
    // for each stavenot element, get their meausre number, clef, and note group order number
    let noteheads_dom = getStaveNoteheadGDoms(vfstavenotesg)
    // console.log(noteheads_dom)

    // now zip the stavenote data and the g dome together, and make a collection of all notes with data and element
    // merge song data into anarray
    let notedata = []
    notedata = mergeNoteData(allStaveNoteData, 'treble', notedata)
    notedata = mergeNoteData(allStaveNoteData, 'bass', notedata)

    // merge song notehead doms
    let notedoms = []
    notedoms = mergeNoteheadDoms(noteheads_dom, 'treble', notedoms)
    notedoms = mergeNoteheadDoms(noteheads_dom, 'bass', notedoms)
    // console.log(notedoms)

    // get xy coordinate of the notedoms, and add as .x .y property
    notedoms = addNoteheadDomXY(notedoms)

    // merge data and doms into thesong
    let theSong = makeTheSong(notedata, notedoms)
    // console.log(theSong)

    /**so far, the doms and the data are lined up */
    // fold the notes by stavenote unit (the notes to be played at the same time), and by clef
    let foldedSongStaveNotes = foldSongNotesbyStavenoteUnit(theSong)
    // console.log(foldedSongStaveNotes)

    // the above is to link data to the individual notehead doms
    /*********************************************************************************** */



    // part two add the piano icons
    /************************************************************** */

    // create measureg elements, each for a stavenote unit
    let parentDOM = d3.select('g#bigg').node()
    let measureGs = makeMeasureGs(parentDOM, foldedSongStaveNotes)
    // console.log(measureGs)

    // add the Piano icon components
    let inner_momentg = await addPianoStaveUnits(measureGs, staveNoteGroups)

    // add Piano keys
    addpianokeys(inner_momentg)


})()







