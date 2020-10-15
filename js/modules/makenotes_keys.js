
// make a collection of note divs, each for a note, save to collections (lnotedivs) and rnotedivs
async function makeNoteDivs(notes) {

    //delete the existing notedivs
    d3.selectAll('g.momentg').remove()

    // determine the number of divs (max 15)
    let n_divs = notes.length

    // now all notes are displayed
    let displaynotes = notes.splice(0, n_divs)

    await addMomentUnits(displaynotes)
    // console.log (lnotedivs , rnotedivs)

}// makenotedivs


async function addMomentUnits(displaynotes) {

    let momentg = d3.select('g#bigg').selectAll('g.momentg').data(displaynotes).enter()
        .append('g')
        .attr('class', 'momentg') // this g is for transform-translate the position of the  moment icon (a set of piano keys indication which keys to press)
        .attr('transform', (d, i) => {
            let x = momentdivdata.maxwidth * i + 20 * i // width of each icon plus 20 px for padding
            let y = 0
            let translateStr = 'translate(' + x + ',' + y + ')'
            return translateStr
        })

    // console.log(d3.selectAll("g.momentg").nodes().length)
    // astr = astr + '<br/>' + 'g.momentg ' + d3.select(d3.selectAll("g.momentg").nodes()[1]).attr('transform')
    // statusdiv.html(astr)

    // the g.moments are moved horizontally according to the order of the displaynote moments

    // // within this momentg, add moment divs for the icons, these divs come in pairs, one for right, one for left
    // // the reason to use div is that we'll need a moment svg within the div
    // //  we cannot use a moment svg directly, as svg itself cannot be move by transfomr-translate unless it is within a div
    // // the reason to use an svg is that it acts as a window, so the g element within can be flexible (bigger than the svg, yet only disply the part within the svg)
    let momentdivsR = momentg.append('foreignObject')
        .attrs({ 'width': momentdivdata.maxwidth, 'height': momentdivdata.maxwidth * 1.5 }) // attr w/h are for the stupid Safari
        .styles({ 'width': momentdivdata.maxwidth + 'px', 'height': momentdivdata.maxwidth * 1.5 + 'px' })
        .append('xhtml:div')
        .styles(momentdivdata.stdstyles)
        .attrs({ 'class': 'momentdivR', 'clef': 'right' })
        .styles({ 'width': momentdivdata.maxwidth + 'px', 'height': (momentdivdata.maxwidth * 1.5) + 'px' })
    let momentdivsL = momentg.append('foreignObject')
        .attrs({ 'width': momentdivdata.maxwidth, 'height': momentdivdata.maxwidth * 1.5 })
        .styles({ 'width': momentdivdata.maxwidth + 'px', 'height': momentdivdata.maxwidth * 1.5 + 'px' })
        .attr('transform', 'translate(0, 200)') // move down for 200 px
        .append('xhtml:div')
        .styles(momentdivdata.stdstyles)
        .attrs({ 'class': 'momentdivL', 'clef': 'left' })
        .styles({ 'width': momentdivdata.maxwidth + 'px', 'height': (momentdivdata.maxwidth * 1.5) + 'px' })
    // console.log(d3.selectAll("div.momentdivR").nodes().length)
    // astr = astr + '<br/>' + 'div.momentdivR ' + d3.selectAll("div.momentdivR").style('width')
    // statusdiv.html(astr)
    // console.log(d3.selectAll("div.momentdivL").nodes().length)
    // astr = astr + '<br/>' + 'div.momentdivL ' + d3.selectAll("div.momentdivL").style('background-color')
    // statusdiv.html(astr)

    // add a set of moment svgs for the right hand icons
    let momentsvgR = momentdivsR.append('svg').attrs({ 'class': 'momentsvgR', 'clef': 'right' }).styles({ "width": momentdivdata.maxwidth, 'height': momentdivdata.maxwidth * 1.5, 'background-color': 'white' })
    let inner_momentgR = momentsvgR.append('g').attrs({ 'class': 'inner_momentgR', 'clef': 'right' })


    // add a set of svgs for the left hand icons
    let momentsvgL = momentdivsL.append('svg').attrs({ 'class': 'momentsvgL', 'clef': 'left' }).styles({ "width": momentdivdata.maxwidth, 'height': momentdivdata.maxwidth * 1.5, 'background-color': 'white' })
    let inner_momentgL = momentsvgL.append('g').attrs({ 'class': 'inner_momentgL', 'clef': 'left' })

    // add piano keys!
    let keysR = inner_momentgR.attr('whatever', (d, i, em) => {
        // console.log(em)
        addpianokeys(d, i, em)
    })
    let keysL = inner_momentgL.attr('whatever', (d, i, em) => {
        // console.log(em)
        addpianokeys(d, i, em)
    })
} //addnotedivunits


function addpianokeys(d, i, em) {
    // determine the min and max leternumber
    // determine the min and max letter number, which is for determining the start and end piano key
    let thenotesdata = d[d3.select(em[i]).attr('clef')] // either left or right
    let minletternum = 9999, maxletternum = 0;
    if (thenotesdata) {
        thenotesdata.forEach(f => {
            if (!isNaN(f.letternum)) {
                minletternum = Math.min(minletternum, f.semi === 'b' ? f.letternum - 1 : f.letternum)
                maxletternum = Math.max(maxletternum, f.semi === '#' ? f.letternum + 1 : f.letternum)
            }
        })
        //draw keys within the min and max range (given that thenodes data is not undefined)
        let keyRange = startEndKeys(thenotesdata, i, em, minletternum, maxletternum)

        drawkeys(keyRange, d, i, em)
    } //if
} // addpianokeys

function drawkeys(keyRange, d, i, em) {

    // white keys
    // e.g., current from G1, then letter char code +1, if  current is G, make the next key as C, octaveN ++
    let theWhiteKeys = setWhiteKeys(keyRange, d)

    makeKeys(theWhiteKeys, d, i, em)

    // if the new key is the end key, stop
    // according to number of keys, determine width of the white key, then the height (to fit all keys within 90% of the div/svg)

    // black keys
    // loop again for white keys, add blackkeys except after B or E
    // determine the black key's width/height based on the height of the white key

    // marked the keys to play, indicate tone letter, octaveN    

} // drawkeys

function makeKeys(theWhiteKeys, d, i, em) {
    addnoteWhitekeys(theWhiteKeys, em[i])
    addnoteBlackkeys(em[i])
} // make keys


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

function setWhiteKeys(keyRange, d) {
    // console.log(keyRange, d)
    // get the keys to press from d
    let presskeydata = d[keyRange.clef]
    let presskeys = presskeydata.map(x => x.tone)
    // console.log(presskeys)

    // make an obj like ['C5': {beat:1, figure:'5'}]
    let presskeydict = {}
    presskeys.forEach((e, i) => {
        presskeydict[e] = {}
        presskeydict[e].data = presskeydata[i]
    })

    // make a collection of keys from startkey to endkey
    let thekeys = []
    let tmp = {}
    tmp.key = keyRange.start
    tmp.press = presskeydict[keyRange.start] ? 1 : 0
    tmp.presskeydata = presskeydict[keyRange.start] ? presskeydict[keyRange.start].data : undefined
    thekeys.push(tmp)

    // get the toneletter and theoctaveN
    let theToneLetter = keyRange.start.substr(0, 1)
    theoctaveN = keyRange.start.substr(1, 1)
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

function startEndKeys(thenotesdata, i, em, minletternum, maxletternum) {

    // console.log(d, i, em[i], minletternum, maxletternum)

    // give the letternum, return tone letter, and octaveN

    let baseN
    if (d3.select(em[i]).attr('clef') === 'left') { baseN = 2 } else { baseN = 4 }

    let toneletter_min = NumToToneLetter(minletternum, anchor_A, n_tone_letters)
    let octaveN_min = parseInt((minletternum - 67) / 7) + baseN

    let toneletter_max = NumToToneLetter(maxletternum, anchor_A, n_tone_letters)
    let octaveN_max = parseInt((maxletternum - 67) / 7) + baseN

    tonekey_min = toneletter_min + octaveN_min
    tonekey_max = toneletter_max + octaveN_max

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

    return { start: startkey, end: endkey, clef: d3.select(em[i]).attr('clef') }

} // startEndKeys