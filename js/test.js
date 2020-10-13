
// make a collection of note divs, each for a note, save to collections (lnotedivs) and rnotedivs
async function makeNoteDivs(notes) {

    //delete the existing notedivs
    d3.selectAll('div.notediv').remove()

    // determin the number of divs to display
    let bigdivl = d3.select('div#bigdivl')
    let bigdivr = d3.select('div#bigdivr')
    bdivsize = bigdivl.node().getBoundingClientRect()

    // determine the number of divs (max 15)
    let n_divs = Math.min(notes.length, maxnotedivs)

    let displaynotes = notes.splice(0, n_divs)
    console.log(displaynotes)
    // width of the notediv
    let width_notediv = Math.min(notedivdata.maxwidth, bdivsize.width / n_divs)

    await addnotedivunits(bigdivl, displaynotes, width_notediv)
    await addnotedivunits(bigdivr, displaynotes, width_notediv)
    // console.log (lnotedivs , rnotedivs)

}// makenotedivs


async function addnotedivunits(parent_d3xn, displaynotes, width_notediv) {

    let notedivs = parent_d3xn.selectAll('div.notediv').data(displaynotes).enter()
        .append('div')
        .attr('class', 'notediv')
        .styles(notedivdata.stdstyles)
        .styles({ 'width': width_notediv + 'px', 'height': (width_notediv * 1.5) + 'px' })
        .attr('id', (d, i) => {
            if (parent_d3xn.attr('id') === 'bigdivl') { return 'lnotediv_' + i } else { return 'rnotediv_' + i }
        })

    let notesvgs = notedivs.append('svg').attr('class', 'notesvg').styles({ "width": '100%', 'height': '100%', 'background-color': 'yellow' })
    let notegs = notesvgs.append('g').attr('class', 'noteg')
        .attr('clef', (d) => {
            if (parent_d3xn.attr('id') === 'bigdivl') { return 'left' } else { return 'right' }
        })

    // add piano keys!
    let keys = notegs.attr('whatever', (d, i, em) => {
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
            let curletn;
            minletternum = Math.min(minletternum, f.semi === 'b' ? f.letternum - 1 : f.letternum)
            maxletternum = Math.max(maxletternum, f.semi === '#' ? f.letternum + 1 : f.letternum)
        })
        //draw keys within the min and max range (given that thenodes data is not undefined)
        let keyRange = startEndKeys(thenotesdata, i, em, minletternum, maxletternum)
        console.log(keyRange)

        drawkeys(keyRange, d, i, em)
    } //if
} // addpianokeys

function drawkeys (keyRange, d, i, em){
    // white keys
    // e.g., current from G1, then letter char code +1, if  current is G, then next is C, octaveN ++
    // if the new key is the end key, stop
    // according to number of keys, determine width of the white key, then the height (to fit all keys within 90% of the div/svg)

    // black keys
    // loop again for white keys, add blackkeys except after B or E
    // determine the black key's width/height based on the height of the white key

    // marked the keys to play, indicate tone letter, octaveN    
    
}

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

    return { start: startkey, end: endkey}

} // startEndKeys