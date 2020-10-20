
/**
 * given the position on the staff line of a music sheet, return a number to be used for the following step for getting
 *  the tone letter
 * 
 * For example, 
 * 
 */

// input: a set of notes data in standard data object; output: a set of notes with tone info (letter, semi or sharp/flat, and octaveN for piano)
function getMusicNotes(d) {
    d.forEach(clefs => {
        // console.log(clefs)
        let cleftkeys = Object.keys(clefs)
        cleftkeys.forEach(f => {
            // console.log(f)
            let notes = clefs[f]
            notes.forEach(g => {
                let staffpos = g.staffpos
                // console.log(staffpos)
                let ln_staffposition1;
                if (f === 'right') { ln_staffposition1 = letternumber_for_staffposition1.r }
                else { ln_staffposition1 = letternumber_for_staffposition1.l }
                let letternum, toneletter, octaveN, semi=''
                if (isNaN(staffpos)) { letternum = staffpos } // NaN is for those rest moments that do not play any tone
                else { letternum = staffpositionToLetterNumber(staffpos, ln_staffposition1) }
                // console.log(letternum)
                if (isNaN(staffpos)) { toneletter = 'R' } else { toneletter = NumToToneLetter(letternum, anchor_A, n_tone_letters) }
                if (isNaN(staffpos)) { octaveN = 0; semi = '' }
                else {
                    // console.log(toneletter)
                    // need to calculate the octave number
                    // for right hand, for C4 the letternum is 67

                    if (g.semi) { semi = g.semi }
                    if (f === 'right') { octaveN = parseInt((letternum - 67) / 7) + 4 }
                    else { octaveN = parseInt((letternum - 67) / 7) + 2 }
                }
                // console.log("octaveN:", octaveN)
                g.tone = toneletter + semi + octaveN
                g.letternum = letternum
                // console.log(g)
            })// note for each

            // console.log(staffpos)
        }) // left/right clef
    })// moment for each

    return d

}// getMusicNotes

