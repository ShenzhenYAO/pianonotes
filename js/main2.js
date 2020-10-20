"use strict"

const notesData = notesStr_test

// init vex.flow
const VF = Vex.Flow;
const notespace = 200; // can adjust stave width, can enlarge, cannot shrink, weird!
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

    // 3. draw stave notes
    let tmpdata = stdnotesdata_clefs[0].contents.slice(0, 6)
    // console.log(tmpdata)

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
    let stdnotesdata_clefs1 = makeVFStaveNotes(stdnotesdata_clefs)
    // console.log(stdnotesdata_clefs1)

    // fold stavenotes of the same measure (bar)
    let stdnotesdata_clefs2 = makeVFMeasures(stdnotesdata_clefs1)
    // console.log(stdnotesdata_clefs2)

    // need to align the staveBounds.x of each measure in differnt clefs
    // e.g., for treble and bass, the first stave may have different lenth
    // however, the second stave should start from the same postion
    // wait! also need to align the position of notes in each clef
    // hmm, should draw two staves at the same time, e.g., measure 0 of treble, and measure 0 of bass
    // That way vex flow will auto align the notes...

    // convert it as [[{measure 0, vfnotes (bass)}, {measure 0, vfnotes (teble)}], {measure 1, ...}]
    let treble = stdnotesdata_clefs2[0].vfmeasures
    let bass = stdnotesdata_clefs2[1].vfmeasures
    let vfmeasures1 = zip(treble, bass)

    // convert it as [{measure: 0, treble:[vfnotes1, 2 ...], bass:}]
    let vfmeasures = makeVFMeasuresByClef(vfmeasures1)
    // console.log(vfmeasures)

    // draw blank staves by clef
    let vfstaves = addBlankStavesByClef(vfmeasures, staveSVG_vft)
    // console.log(vfstaves)


    let startX = 0
    vfmeasures.forEach((d, i) => {
        let vfnotes, stavenotes, stavenotegroups, setStrictOff 

        //treble
        vfnotes = d.treble
        let trebleGroup, staveTreble
        if (d.treble) {
            // arrange vfnotes into a collection of vfstavenotes, indicate addAccidentals, dots, separate notes requiring beams or tuplets
            stavenotes = makeStaveNotes(vfnotes)
            
            // group stavenotes according to group number, indicate type of the group(plain, beam, or tuplet)
            stavenotegroups = makeStaveNoteGroups(stavenotes)
            // draw notes
            setStrictOff = 1
            staveTreble = vfstaves[i].treble
            trebleGroup = makeAllStaveNotegroupsInAMeasure(staveTreble, stavenotegroups, beatperquarternote, setStrictOff)
        }

        //bass
        vfnotes = d.bass
        // console.log(d.bass)
        let bassGroup, staveBass
        if (d.bass) {
            // arrange vfnotes into a collection of vfstavenotes, indicate addAccidentals, dots, separate notes requiring beams or tuplets
            stavenotes = makeStaveNotes(vfnotes)
            // group stavenotes according to group number, indicate type of the group(plain, beam, or tuplet)
            stavenotegroups = makeStaveNoteGroups(stavenotes)
            // draw notes
            setStrictOff = 1
            staveBass = vfstaves[i].bass
            bassGroup = makeAllStaveNotegroupsInAMeasure(staveBass, stavenotegroups, beatperquarternote, setStrictOff)
        }

        // https://github.com/0xfe/vexflow/wiki/The-VexFlow-FAQ#how-do-i-align-multiple-voices-across-staves

        let voiceTreble = trebleGroup.measure
        let voiceBass = bassGroup.measure

        let notesTreble = trebleGroup.allgroups
        let notesBass = bassGroup.allgroups

        voiceTreble.addTickables(notesTreble).setStave(staveTreble);
        voiceBass.addTickables(notesBass).setStave(staveBass);

        var formatter = new Vex.Flow.Formatter();

        // Make sure the staves have the same starting point for notes
        // var startX = Math.max(staveTreble.getNoteStartX(), staveBass.getNoteStartX());
        staveTreble.setNoteStartX(startX);
        staveBass.setNoteStartX(startX);
        // console.log(startX)

        // the treble and bass are joined independently but formatted together
        // console.log(voiceTreble)
        formatter.joinVoices([voiceTreble]);
        formatter.joinVoices([voiceBass]);
        formatter.format([voiceTreble, voiceBass], voiceTreble.stave.bounds.w);

        let ctx = staveSVG_vft.getContext(); // or context

        voiceTreble.setContext(ctx).draw();
        voiceBass.setContext(ctx).draw();

        // add tuplets and beams
        if (trebleGroup.tuplets.length > 0) {
            trebleGroup.tuplets.forEach(tuplet => {
                tuplet.setContext(ctx).draw()
            })
        } // if tuplets
        if (trebleGroup.beams.length > 0) {
            trebleGroup.beams.forEach(beam => {
                beam.setContext(ctx).draw()
            })
        } // if beams
        if (bassGroup.tuplets.length > 0) {
            bassGroup.tuplets.forEach(tuplet => {
                tuplet.setContext(ctx).draw()
            })
        } // if tuplets
        if (bassGroup.beams.length > 0) {
            bassGroup.beams.forEach(beam => {
                beam.setContext(ctx).draw()
            })
        } // if beams
        
        // update the startX position
        startX = voiceTreble.stave.end_x -50

    })




})()







