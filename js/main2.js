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


    // the above is to link data to the individual notehead doms
    /*********************************************************************************** */

    let foldedSongStaveNotes = foldSongNotesbyStavenoteUnit(theSong)
    // console.log(foldedSongStaveNotes)

    // part two add the piano icons
    /************************************************************** */

    // create measureg elements, each for a stavenote unit
    let parentDOM = d3.select('g#bigg').node()
    let measureGs = makeMeasureGs(parentDOM, foldedSongStaveNotes)
    // console.log(measureGs)

    // add the Piano icon components
    let inner_momentg = await addPianoStaveUnits(measureGs)

    // add Piano keys
    addpianokeys(inner_momentg)


})()


function addpianokeys(inner_momentg) {

    // add piano keys!
    let keys = inner_momentg.attr('whatever', (d, i, em) => {
        // console.log(d)
        // determine the min and max letternumber
        // determine the min and max letter number, which is for determining the start and end piano key
        let minletternum = 9999, maxletternum = 0;
        d.notes.forEach(f => {
            // console.log(f)
            if (!isNaN(f.data.letternum)) {
                minletternum = Math.min(minletternum, ['b', 'f'].includes(f.data.accidentals) ? f.data.letternum - 1 : f.data.letternum)
                maxletternum = Math.max(maxletternum, ['s', '#'].includes(f.data.accidentals) ? f.data.letternum + 1 : f.data.letternum)
            } else {
                minletternum = 39
                maxletternum = 39
            }
        })
        // console.log (minletternum, maxletternum)

        //draw keys within the min and max range (given that thenodes data is not undefined)
        let keyRange = startEndKeys(d.clef, minletternum, maxletternum)
        // console.log(keyRange)

        // make the keys for the piano icon
        drawkeys(keyRange, d, i, em)

    })

} // addpianokeys

function startEndKeys(clef, minletternum, maxletternum) {

    // give the letternum, return tone letter, and octaveN
    let baseN
    if (clef === 'bass') { baseN = 2 } else { baseN = 4 }

    let toneletter_min = NumToToneLetter(minletternum, anchor_A, n_tone_letters)
    // console.log(toneletter_min)
    let octaveN_min = parseInt((minletternum - 67) / 7) + baseN

    let toneletter_max = NumToToneLetter(maxletternum, anchor_A, n_tone_letters)
    let octaveN_max = parseInt((maxletternum - 67) / 7) + baseN

    let tonekey_min = toneletter_min + octaveN_min
    let tonekey_max = toneletter_max + octaveN_max

    // the idea is to know the start and end key to be draw
    //1. if the start and end keys are the same, draw a standard map (C-F, or G-C)
    //2.  else if the start and end keys are within C-F, or G-C, same as the first
    //3.  else if the start and end keys are within 4 letternumbers (inclusive), startkey, + 4 whitekeys
    //4.  else if the start and end keys are more than 4 letternumbers apart, starteky, endkey
    let startkey, endkey;
    if (maxletternum - minletternum > 2) { // 4
        startkey = tonekey_min, endkey = tonekey_max
    } else if (['C', 'D', 'E', 'F'].includes(toneletter_min) && ['C', 'D', 'E', 'F'].includes(toneletter_max)) {
        startkey = 'C' + octaveN_min, endkey = 'F' + octaveN_max
    } else if (['G', 'A', 'B', 'C'].includes(toneletter_min) && ['G', 'A', 'B', 'C'].includes(toneletter_max)) {
        startkey = 'G' + octaveN_min, endkey = 'C' + octaveN_max
    } else {
        startkey = tonekey_min
        // calculate the end key, 
        let letternum_endkey = minletternum + 3
        let toneletter_endkey = NumToToneLetter(letternum_endkey, anchor_A, n_tone_letters)
        let octaveN_endkey = parseInt((letternum_endkey - 67) / 7) + baseN
        endkey = toneletter_endkey + octaveN_endkey
    } //

    return { start: startkey, end: endkey, clef: clef }

} // startEndKeys


function drawkeys(keyRange, d, i, em) {

    // white keys
    // e.g., current from G1, then letter char code +1, if  current is G, make the next key as C, octaveN ++
    let theWhiteKeys = setWhiteKeys(keyRange, d)

    addnoteWhitekeys(theWhiteKeys, em[i])
    addnoteBlackkeys(em[i])

} // drawkeys

function addnoteWhitekeys(theWhiteKeys, em) {
    let thenodegs_d3xn = d3.select(em)//.select('g.noteg')
    // console.log(thenodegs_d3xn, theWhiteKeys)
    let whitekeyg = thenodegs_d3xn.selectAll('g.notewhitekeyg').data(theWhiteKeys).enter().append('g').attr('class', 'notewhitekeyg')
    let whitekeys = whitekeyg
        .append('rect')
        .attrs(notekeydata.white.stdattrs)
        .attr('width', () => {
            // the width of the notesvg *90% / the number of whitekeys
            // get the width of the notesvg

            // let size_thenotesvg_dom = em.parentNode.getBoundingClientRect()

            // do not use .getBoundingClientRect() as it is not recognized by Safari
            // instead, use jquery .width(). Note, it works for divs/svgs but not gs
            let size_thenotesvg_dom = { width: $(em.parentNode).width(), height: $(em.parentNode).height() }

            // get its size
            let width_noteg = size_thenotesvg_dom.width
            let width_whitenotekey = width_noteg / theWhiteKeys.length
            // console.log(width_whitenotekey)
            return width_whitenotekey
        })
        .attr('height', (d, i, elm) => {
            let thisdom = elm[i]

            // get the width of the key

            // let width_whitenotekey = thisdom.getBoundingClientRect().width

            // do not use .getBoundingClientRect() as it is not recognized by Safari
            // instead, use jquery .width(). However, it works for divs/svgs, not  gs
            // so, get the notesvg's width
            // then divided by the number of whitekeys to get width of individual white key!
            let width_notesvg = $(em.parentNode).width()
            // console.log(width_notesvg, theWhiteKeys.length)
            let width_whitenotekey = width_notesvg / theWhiteKeys.length


            // console.log(width_whitenotekey)
            let height_whitenoteky = pianokeysize.white.length * width_whitenotekey / pianokeysize.white.width
            // console.log(width_whitenotekey, height_whitenoteky)
            return height_whitenoteky
        })
        .attr('transform', (d, i, elm) => {
            let thisdom = elm[i]
            // get the width of the key (must calculate based on the notesvg's size)
            // get the width of the key


            // let width_whitenotekey = thisdom.getBoundingClientRect().width

            // do not use .getBoundingClientRect() as it is not recognized by Safari
            // instead, use jquery .width(). However, it works for divs/svgs, not  gs
            // so, get the notesvg's width
            // then divided by the number of whitekeys to get width of individual white key!
            let width_notesvg = $(em.parentNode).width()
            // console.log(width_notesvg, theWhiteKeys.length)
            let width_whitenotekey = width_notesvg / theWhiteKeys.length


            // let width_whitenotekey =  $(thisdom).width()
            let x = width_whitenotekey * i

            let translateStr = 'translate(' + x + ', 0)'
            // console.log(translateStr)
            return translateStr
        })
        // indicate the pressed key
        .attr('fill', d => {
            // console.log(d)
            let fill = d.press ? notekeydata.pressedcolor : 'white'
            return fill
        })

    // add tone letter
    thenodegs_d3xn.selectAll('g.notewhitekeyg').append('text')
        .attrs(pianokeydata.stdtextattrs.white)
        .attr('transform', (d, i, elm) => {

            // get height of the rect
            let whitekeyg = elm[i].parentNode
            // let width_whitenotekey = whitekeyg.getBoundingClientRect().width 

            // do not use .getBoundingClientRect() as it is not recognized by Safari
            // instead, use jquery .width(). Note, it works for divs/svgs
            let width_notesvg = $(em.parentNode).width()
            // console.log(width_notesvg, theWhiteKeys.length)
            let width_whitenotekey = width_notesvg / theWhiteKeys.length

            // let height_whitenotekey = whitekeyg.getBoundingClientRect().height
            // do not use .getBoundingClientRect() as it is not recognized by Safari
            // Note, the white key height is not the same as the notesvg height (the svg is bigger)
            // use the standard key ratio (length/width) to determine the whitenotekey's height
            let height_whitenotekey = width_whitenotekey * pianokeysize.white.length / pianokeysize.white.width


            // console.log(height_whitenotekey)
            let x = width_whitenotekey / 8 + width_whitenotekey * i
            let y = height_whitenotekey * 7 / 8
            let translateStr = 'translate(' + x + ', ' + y + ')'
            return translateStr
        })
        .text(d => { return d.key })

    // add finger label
    thenodegs_d3xn.selectAll('g.notewhitekeyg').append('text')
        .attrs(pianokeydata.stdtextattrs.white)
        .attr('transform', (d, i, elm) => {

            // get height of the rect
            let whitekeyg = elm[i].parentNode
            // let width_whitenotekey = whitekeyg.getBoundingClientRect().width
            // let height_whitenotekey = whitekeyg.getBoundingClientRect().height

            // do not use .getBoundingClientRect() as it is not recognized by Safari
            // instead, use jquery .width(). Note, it works for divs/svgs
            let width_notesvg = $(em.parentNode).width()
            // console.log(width_notesvg, theWhiteKeys.length)
            let width_whitenotekey = width_notesvg / theWhiteKeys.length

            // let height_whitenotekey = whitekeyg.getBoundingClientRect().height
            // do not use .getBoundingClientRect() as it is not recognized by Safari
            // Note, the white key height is not the same as the notesvg height (the svg is bigger)
            // use the standard key ratio (length/width) to determine the whitenotekey's height
            let height_whitenotekey = width_whitenotekey * pianokeysize.white.length / pianokeysize.white.width

            // console.log(height_whitenotekey)
            let x = width_whitenotekey / 8 + width_whitenotekey * i
            let y = height_whitenotekey * 1.1
            let translateStr = 'translate(' + x + ', ' + y + ')'
            return translateStr
        })
        .text(d => { return (d.press && d.presskeydata.finger) ? d.presskeydata.finger : '' })


} // addWhitekeys

function addnoteBlackkeys(em) {

    // get the data linked to the noteg
    let note_d3xn = d3.select(em)
    let notedata_d3bh = note_d3xn.datum


    // get the white keys that have been plotted in noteg
    let whitekeys_d3xn = note_d3xn.selectAll('g.notewhitekeyg')
    // for each white key's tone letter, determine whether or not to add a black key (not for E or B) 
    whitekeys_d3xn.attr('whatever', (d, i, elm) => {
        // get the white key tone letter
        let whitekeyToneLetter = d.key.substr(0, 1)
        let octaveN = d.key.substr(1, 1)

        // for thefirst white key , add a black key before it (if the white key is not C or F)
        if (i === 0 && !['F', 'C'].includes(whitekeyToneLetter)) {
            addABlackKey(em, -1, elm[0])
        }

        if (!(['E', 'B'].includes(whitekeyToneLetter))) {
            addABlackKey(em, i, elm[i])
        }
    }) // add a black key
} //addnoteBlackkeys

function addABlackKey(notegdom, whitekeyindex, thiswhitekeygdom) {
    // console.log(notegdom,thiswhitekeygdom)
    // in the notegdom, add a noteblackkeyg
    let noteg_d3xn = d3.select(notegdom)
    // make an empty data, and link it to the blackg
    let theblackkeyg = noteg_d3xn.append('g').attr('class', 'noteblackkeyg')
    let theblackkey = theblackkeyg.append('rect').attrs(notekeydata.black.stdattrs)

    //determine its width, which is a black key's standard width in raito of acutal white key width / stand white keywidth 
    // let width_whitenotekey = thiswhitekeygdom.getBoundingClientRect().width

    // do not use .getBoundingClientRect() as it is not recognized by Safari
    // instead, use jquery .width(). However, it works for divs/svgs, not  gs
    // so, get the notesvg's width
    // then divided by the number of whitekeys to get width of individual white key!
    let width_notesvg = $(notegdom.parentNode).width()
    // count the whitekeygs within the notegdom
    let theWhiteKeys_length = d3.select(notegdom).selectAll('g.notewhitekeyg').nodes().length
    // console.log(width_notesvg, theWhiteKeys.length)
    let width_whitenotekey = width_notesvg / theWhiteKeys_length


    let width_blacknotekey = pianokeysize.black.width * width_whitenotekey / pianokeysize.white.width
    let height_blacknotekey = pianokeysize.black.length * width_blacknotekey / pianokeysize.black.width

    theblackkey.attrs({ 'width': width_blacknotekey, 'height': height_blacknotekey })
    // move it to right for half of the width_whitenotekey
    theblackkey.attr('transform', d => {
        // console.log(d3.select(thiswhitekeygdom))
        let x
        if (whitekeyindex < 0) { x = - width_blacknotekey / 2 }
        else {
            x = width_whitenotekey - width_blacknotekey / 2 + width_whitenotekey * whitekeyindex
        }
        return 'translate(' + x + '0)'
    })
    // unlike white keys, there is no tone letters linked to black keys at this moment. The next is to indicate the Tone letter of the black key
    theblackkey.attr('data', d => {
        // console.log(d3.select(thiswhitekeygdom))
        let x, thisblackkeyTone
        if (whitekeyindex < 0) {
            // it is the flat tone of the curent white key
            let thiswhitekeyTone = d3.select(thiswhitekeygdom).datum().key
            let thisblackkeyFlatTone = thiswhitekeyTone.substr(0, 1) + "b" + thiswhitekeyTone.substr(1, 1)

            // but it is also a previous whitekey's sharp tone
            let thisWhitekeyToneLetter = thiswhitekeyTone.substr(0, 1)
            let theoctaveN = thiswhitekeyTone.substr(1, 1)
            let thiswhitekeyCharCode = thisWhitekeyToneLetter.charCodeAt(0)
            let previousWhitekeyCharCode = thiswhitekeyCharCode - 1;
            let previousWhitekeyToneLetter = String.fromCharCode(previousWhitekeyCharCode)
            if (thisWhitekeyToneLetter === 'A') { previousWhitekeyToneLetter = 'G' } // return to G before A
            if (previousWhitekeyToneLetter === 'B') { theoctaveN = theoctaveN - 1 } // reduce the octave number by one as if the previous toneletter is a B
            let thisblackkeySharpTone = previousWhitekeyToneLetter + "#" + theoctaveN
            let tmp = { tone: { sharp: thisblackkeySharpTone, flat: thisblackkeyFlatTone } }
            return JSON.stringify(tmp) // only can save str in DOM properties
        }

        else {
            // it is the sharp tone of the curent white key
            let thiswhitekeyTone = d3.select(thiswhitekeygdom).datum().key
            let thisblackkeySharpTone = thiswhitekeyTone.substr(0, 1) + "#" + thiswhitekeyTone.substr(1, 1)

            // but it is also the next whitekey's flat tone
            let thisWhitekeyToneLetter = thiswhitekeyTone.substr(0, 1)
            let theoctaveN = thiswhitekeyTone.substr(1, 1)
            let thiswhitekeyCharCode = thisWhitekeyToneLetter.charCodeAt(0)
            let nextWhitekeyCharCode = thiswhitekeyCharCode + 1;
            let nextWhitekeyToneLetter = String.fromCharCode(nextWhitekeyCharCode)
            if (thisWhitekeyToneLetter === 'G') { nextWhitekeyToneLetter = 'A' } // return to A after G
            if (nextWhitekeyToneLetter === 'C') { theoctaveN = theoctaveN + 1 } // incerease the octave number by one as if the next toneletter is a C
            let thisblackkeyFlatTone = nextWhitekeyToneLetter + "b" + theoctaveN
            let tmp = { tone: { sharp: thisblackkeySharpTone, flat: thisblackkeyFlatTone } }
            return JSON.stringify(tmp) // only can save str in DOM properties
        } // if else
    }) // attr data

    // determine whether the black key should be pressed
    // get the note data of this note g
    let notedata_d3bh = noteg_d3xn.datum()
    // determine whether this black key is for left or right hand
    let clef = noteg_d3xn.attr('clef').trim()
    let data_notesToPlay = notedata_d3bh[clef]
    // check notes
    data_notesToPlay.forEach(f => {
        // get the tone to play
        theToneToPlay = f.tone.trim()

        if (theblackkey.attr('data')) {
            let datastr = theblackkey.attr('data')
            let presskeydata = JSON.parse(datastr)
            let theblackkeytone = presskeydata.tone
            // console.log(theToneToPlay)
            if (theToneToPlay === theblackkeytone.sharp || theToneToPlay === theblackkeytone.flat) {
                // console.log(theblackkeytone, theToneToPlay)
                theblackkey.attr('press', 1) // for whitekeys, the .press and .data is saved in rect's binding data
                // for black keys, so far save it as rect dom attrs .press =1, and .data = stringify(f)
                theblackkey.attr('data', JSON.stringify(f))
                theblackkey.attr('fill', notekeydata.pressedcolor)
            } //
        } // theblackkey.attr('data)
    }) // forEach note to play
} // addABlackKey

function setWhiteKeys(keyRange, d) {
    // console.log(keyRange, d)
    let notesdata = d.notes
    // console.log(notesdata)
    // get the keys to press from d
    let presskeydata = notesdata.map(x => x.data)
    // console.log(presskeydata)
    let presskeys = presskeydata.map(x => x.toneletter + x.octave)
    // console.log(presskeys)

    // make an obj like ['C5': {beat:1, figure:'5'}]
    let presskeydict = {}
    presskeys.forEach((e, i) => {
        presskeydict[e] = {}
        presskeydict[e].data = presskeydata[i]
    })
    // console.log(presskeydict)

    // make a collection of keys from startkey to endkey
    let thekeys = []
    let tmp = {}
    tmp.key = keyRange.start
    tmp.press = presskeydict[keyRange.start] ? 1 : 0
    tmp.presskeydata = presskeydict[keyRange.start] ? presskeydict[keyRange.start].data : undefined
    thekeys.push(tmp)
    // console.log(thekeys)

    // get the toneletter and theoctaveN
    let theToneLetter = keyRange.start.substr(0, 1)
    let theoctaveN = keyRange.start.substr(1, 1)
    let theEndToneLetter = keyRange.end.substr(0, 1)
    // console.log(theToneLetter)
    //
    while (theToneLetter !== 'R') { // a while loop that could go forever
        // make the next key
        let theCharCode = theToneLetter.charCodeAt(0)
        let nextCharCode = theCharCode + 1;
        theToneLetter = String.fromCharCode(nextCharCode)
        if (theToneLetter === 'H') { theToneLetter = 'A' } // return to A after G
        if (theToneLetter === 'C') { theoctaveN++ } // add octave number as of C
        let thenextkey = theToneLetter + theoctaveN
        let tmp2 = {}
        tmp2.key = thenextkey
        tmp2.press = presskeydict[thenextkey] ? 1 : 0
        tmp2.presskeydata = presskeydict[thenextkey] ? presskeydict[thenextkey].data : undefined
        thekeys.push(tmp2)
        if (theToneLetter === theEndToneLetter) { break } // stop when the endkey is reached
    }
    // console.log(thekeys)
    return thekeys
} // makeWhiteKeys






