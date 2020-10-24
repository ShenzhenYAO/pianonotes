// make g elemnts, each corresponding to a stavenote unit (the notes to be played at the same time)
function makePianoStavenoteGs(parentDom, data) {
    let PianoStavenoteGs = d3.select(parentDom).selectAll('g.PianoStavenoteG').data(data).enter()
        .append('g')
        .attr('class', 'PianoStavenoteG') // this g is for transform-translate the position of the  PianoStavenote icon (a set of piano keys indication which keys to press)
    return PianoStavenoteGs
} //makePianoStavenoteGs

// add the notes to be placed at the same time, by clef
async function addPianoStaveUnits(PianoStavenoteGs, staveNoteGroups) {
    PianoStavenoteGs.attr('transform', (d, i, em) => {
        // console.log(d)
        // console.log(staveNoteGroups[d.clef][d.measure].measure.stave.bounds.x)
        // let x = PianoStavenotedivdata.maxwidth * i + 20 * i // width of each icon plus 20 px for padding
        let measurestartX = staveNoteGroups[d.clef][d.measure].measure.stave.bounds.x
        // the above is to find the start x of the vf stave by the clef and measure data from the song data


        /***following is for offset of x within the measure */
        // let stavenoteOffset = d.stavenotenumber * (PianoStavenotedivdata.maxwidth + 30) * scale_pianoicons

        // the offset is such that
        // need to get the stavenotes' first notehead dom's x position (d.notes[0].noteheaddom.x)
        // console.log(d.notes[0].noteheaddom.x)
        // need to get all such x positions of the staves within the same measure (both treble and bass)
        let StavenotesOftheSameMeasure = []
        PianoStavenoteGs.data().forEach(e => {
            if (e.measure === d.measure) { StavenotesOftheSameMeasure.push(e) }
        })
        // console.log(StavenotesOftheSameMeasure)

        // for example, In the first measure, there is one stave for the treble clef, and three for the bass clef
        // each of these measures can be identified by its clef, measure number, and stavenotenumber
        //  (.clef, .measure, and .stavenotenumber)
        // on the other hand, these staves have their own x positions: .notes[0].noteheaddom.x
        // the idea is to make a map, sort by x positons of each stave
        let staveOrderNumbers = []
        StavenotesOftheSameMeasure.forEach(f => {
            let id = f.clef + '_' + f.measure + '_' + f.stavenotenumber
            let x = parseInt(f.notes[0].noteheaddom.x)
            staveOrderNumbers.push({ id: id, x: x })
        })

        // sort the staves by their x value
        staveOrderNumbers = staveOrderNumbers.sort((a, b) => (a.x > b.x) ? 1 : -1)

        // set the order number of the stave, only increase if x changes
        let order = -1, previousX = -99999999
        let staveOrderDict = {}
        staveOrderNumbers.forEach(f => {
            // console.log(f)
            if (previousX !== f.x) { order++ } // if
            f.order = order
            // console.log(order)
            staveOrderDict[f.id] = order
            previousX = f.x
        }) // forEach
        // console.log(staveOrderNumbers)
        // console.log(staveOrderDict)

        // now look up the staveOrderDict, and find the order number of the current stave (d)
        let currentstaveid = d.clef + '_' + d.measure + '_' + d.stavenotenumber
        let orderOfcurrentstave = staveOrderDict[currentstaveid]
        d.momentorder = orderOfcurrentstave
        // console.log(orderOfcurrentstave)
        // console.log(d)

        let stavenoteOffset = orderOfcurrentstave * (PianoStavenotedivdata.maxwidth + 30) * scale_pianoicons
        /** whew! the above is to set the correct position! */


        // sort these x positions so as to determine the order of the piano icons
        // set offset according to the order number

        let x = measurestartX + stavenoteOffset
        let y = (d.clef === 'treble' ? trebleStaveYOffset + pianoiconDistanceFromStaveNotes : trebleStaveYOffset + staveDistanceBetweenClefs + pianoiconDistanceFromStaveNotes )
        let translateStr = 'translate(' + x + ',' + y + ')scale(' + scale_pianoicons + ')'
        return translateStr
    }) // loop for each PianoStavenoteG

    // the g.PianoStavenotes are moved horizontally according to the order of the displaynote PianoStavenotes
    let PianoStavenoteFO = PianoStavenoteGs.append('foreignObject')
        .attrs({ 'width': PianoStavenotedivdata.maxwidth, 'height': PianoStavenotedivdata.maxwidth * 1.8 }) // attr w/h are for the stupid Safari
        .styles({ 'width': PianoStavenotedivdata.maxwidth + 'px', 'height': PianoStavenotedivdata.maxwidth * 1.8 + 'px' })
        .attr('transform', d => {
            let y = stavedivdata.height * 1.2
            return 'translate(0, ' + y + ')'
        }) // move down for 200 px

    let PianoStavenotedivs = PianoStavenoteFO
        .append('xhtml:div')
        .styles(PianoStavenotedivdata.stdstyles)
        .attrs({ 'class': 'PianoStavenotediv' })
        .styles({ 'width': PianoStavenotedivdata.maxwidth + 'px', 'height': (PianoStavenotedivdata.maxwidth * 1.8) + 'px' })

    // add a set of PianoStavenote svgs for the right hand icons
    let PianoStavenotesvg = PianoStavenotedivs.append('svg').attrs({ 'class': 'PianoStavenotesvg' }).styles({ "width": PianoStavenotedivdata.maxwidth, 'height': PianoStavenotedivdata.maxwidth * 1.8, 'background-color': 'white' })
    let inner_PianoStavenoteg = PianoStavenotesvg.append('g').attrs({ 'class': 'inner_PianoStavenoteg' })

    return inner_PianoStavenoteg

} //addPianoStaveUnits



function addpianokeys(inner_PianoStavenoteg) {

    // add piano keys!
    let keys = inner_PianoStavenoteg.attr('whatever', (d, i, em) => {
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

    }) // inner_PianoStavenoteg

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
    // console.log(d)

    let toneletter = d.notes[0].data.toneletter
    // console.log(toneletter)

    // if the stavenotes contains R (rest PianoStavenotes), do not draw the piano icon
    if (toneletter !== 'R') {
        // white keys
        // e.g., current from G1, then letter char code +1, if  current is G, make the next key as C, octaveN ++
        let theWhiteKeys = setWhiteKeys(keyRange, d)

        addnoteWhitekeys(theWhiteKeys, em[i])
        addnoteBlackkeys(em[i])
    }

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
        .styles({'font-size': 20, 'font-weight': 'bold', 'text-align':'left'})
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
            let x = width_whitenotekey / 3 + width_whitenotekey * i
            let y = height_whitenotekey * 1.2
            let translateStr = 'translate(' + x + ', ' + y + ')'
            return translateStr
        })
        .text(d => { 
            // console.log(d.presskeydata)
            return (d.press && d.presskeydata.finger) ? d.presskeydata.finger : '' 
        })

} // addWhitekeys

function addnoteBlackkeys(em) {

    // get the data linked to the noteg
    let note_d3xn = d3.select(em)

    // get the white keys that have been plotted in noteg
    let whitekeys_d3xn = note_d3xn.selectAll('g.notewhitekeyg')
    // for each white key's tone letter, determine whether or not to add a black key (not for E or B) 
    whitekeys_d3xn.attr('whatever', (d, i, elm) => {
        // get the white key tone letter
        let whitekeyToneLetter = d.key.substr(0, 1)

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
    // unlike white keys, there is no tone letters linked to black keys at this PianoStavenote. The next is to indicate the Tone letter of the black key
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
        } else {
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
    // console.log(notedata_d3bh)
    // determine whether this black key is for left or right hand
    let clef = noteg_d3xn.clef
    let data_notesToPlay1 = notedata_d3bh.notes
    let data_notesToPlay = data_notesToPlay1.map(x => x.data)
    // console.log(data_notesToPlay)
    // check notes
    data_notesToPlay.forEach(f => {
        // console.log(f)
        // get the tone to play
        let accidentals
        if (['s', '#'].includes(f.accidentals)) { accidentals = '#' }
        if (['b', 'f'].includes(f.accidentals)) { accidentals = 'b' }
        let theToneToPlay = f.toneletter.trim() + accidentals + f.octave
        // console.log(theToneToPlay)

        if (theblackkey.attr('data')) {
            let datastr = theblackkey.attr('data')
            let presskeydata = JSON.parse(datastr)
            // console.log(presskeydata)
            let theblackkeytone = presskeydata.tone
            // console.log(theToneToPlay)
            if (theToneToPlay === theblackkeytone.sharp || theToneToPlay === theblackkeytone.flat) {
                // console.log(theblackkeytone, theToneToPlay)
                theblackkey.attr('press', 1) // for whitekeys, the .press and .data is saved in rect's binding data
                // for black keys, so far save it as rect dom attrs .press =1, and .data = stringify(f)
                theblackkey.attr('notedata', JSON.stringify(f))
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
    let presskeys = presskeydata.map(x => {
        let accidentals = ''
        if (['f', 'b'].includes(x.accidentals)) { accidentals = 'b' }
        if (['s', '#'].includes(x.accidentals)) { accidentals = '#' }
        return x.toneletter + accidentals + x.octave
    })
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


// add the pianoicon into the data of theSong, making it like {clef, data, noteheaddom, pianostavenotegdom}
// theSong = mergePianoStavenoteGsIntoTheSong(theSong, inner_PianoStavenoteg)
// // console.log(theSong)

function mergePianoStavenoteGsIntoTheSong(theSong, inner_PianoStavenoteg) {
    // console.log(inner_PianoStavenoteg)
    // loop for each element in theSong
    theSong.forEach(d=>{
        // get str for clef, measure, stavenotenumber
        let theSongNoteidStr = d.clef + '_' + d.data.measure + '_' + d.data.stavenotenumber
        d.measure = d.data.measure
        d.stavenotenumber = d.data.stavenotenumber
        
        // console.log(idStr)
        // loop for each g dom of inner_PianoStavenoteg
        let inner_PianoStavenoteg_doms=inner_PianoStavenoteg.nodes()
        for (let k=0;k<inner_PianoStavenoteg_doms.length;k++ ){
            let e =d3.select(inner_PianoStavenoteg_doms[k]).datum()
            let pianostavenotegIdStr = e.clef + '_' + e.measure + '_' + e.stavenotenumber
            // console.log(theSongNoteidStr, pianostavenotegIdStr)
            if (theSongNoteidStr === pianostavenotegIdStr ){
                d.pianostavenotegdom = inner_PianoStavenoteg_doms[k]
                d.momentorder = e.momentorder
                break
            } // if id matches                
        } // for k loop
        d.momentid = d.measure * 1000000 + d.momentorder

    }) // theSong forEach

    let sortedNotesInSong = theSong.sort(function (a, b) {
        return a["measure"] - b["measure"] || a["momentorder"] - b["momentorder"];
    });

    return sortedNotesInSong
} // mergePianoStavenoteGsIntoTheSong()
