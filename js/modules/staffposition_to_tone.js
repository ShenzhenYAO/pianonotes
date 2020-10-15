
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


function staffpositionToLetterNumber(staffposition, letternumber_for_staffposition1) {
    // skip is the number of letters to skip .
    // e.g., if the staffposition is 2.5 (the second space above the staff line 1), 
    // and the letter number (letternumber_for_staffposition1) for staff line 1 is 69
    // then the skip is (2.5-1)*2 = 3, meaning that the returned letternumber represents a letter that is 3rd letter after the letter for staff position 1 in alphabetic order
    // in this function, only the letter number is determined. The letter behind will be determined by the next function
    let skip = (staffposition - 1) * 2
    let letternumber = skip + letternumber_for_staffposition1
    return letternumber
} // staffpositionToNumber



/**Given the number (n), the anchor number representing the letter A(anchor_A), and the range of letters (rng)
 * return the letter corresponding to the number
 * 
 * e.g., if the anchor number anchor_A = 65 (in ASCII, 65 represents A), and the range (rng) = 7
 *  then the purpose is to return a letter between A and G (7 letters)
 * for a given number 66, it'll return B
 * 
 */
function NumToToneLetter(letternumber, anchor_A, rng) {

    // get the remainder of anchor_A, which is the distance between thenumber, and the anchor_A
    // e.g., if anchor_A = 65, letternumber = 73, the remainder refers to that the desired letter is 8 steps away from the anchor letter A
    let remainder = letternumber % anchor_A;
    // get the remainder within the given range, which recalculate the distance, and limit the distance within the range 0 and 6
    // in the above case, it'll have the remainder of 1 (i.e., despite that the original distance is 8, the 
    // distance is recalculated after 7. As a result, the recalculated disance is now 1)
    let remainder2 = remainder % rng;

    // return the letter, which is away from the anchor_A for the recalculated distance in remainder2
    // in the above case, it'll be B
    let letter = String.fromCharCode(anchor_A + remainder2)
    return letter
} // NumToToneLetter
/**THe above is part of the steps to determine a tone letter in music sheets */