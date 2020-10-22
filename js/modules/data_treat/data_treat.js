// read each line of the data, record line number and bar number (by empty lines)
// input: {text: `...`}
// output: {clef:'treble', str'..', dataline: 2, bar: 2}
function makeNoteStrLines(notesdata_theclef, theclef) {
    let strlines_crude = notesdata_theclef.split(/\n/)
    let strlines = [], bar = -1, emptyline
    strlines_crude.forEach((e, i) => {
        let thestr = e.trim()
        if (thestr.length > 0) {
            if (emptyline ===1) {bar++; emptyline=0};
            let tmp = {}
            tmp.clef = theclef
            tmp.str = thestr
            tmp.dataline = i
            tmp.bar = bar
            strlines.push(tmp)
            // console.log(thestr)
            // console.log(strlines_crude[i-1].trim(),strlines_crude[i-1].trim().length ===0, bar )
            
        } else {
            emptyline = 1
        } 
        //if            
    }) //strlines_crude.forEach
    return strlines
} //makeNoteStrLines()

/**
 * input: [{clef:.., str:'3.5,1 ; 4,1}] (notes splitted by ;)
 * output: [{clef:.., str:'3.5,1 }, {clef:.., str:' 4,1}]
 */
function getDataEachNote(noteStrLines) {
    let dataStr_eachnote = []
    noteStrLines.forEach(f => {
        let _arr = f.str.split(';')
        _arr.forEach(g => {
            let tmp = {}
            tmp.clef = f.clef, tmp.dataline = f.dataline, tmp.bar = f.bar
            tmp.str = g
            dataStr_eachnote.push(tmp)
        })
    })
    // console.log(dataStr_eachnote)
    return dataStr_eachnote
} // getDataEachNote(noteStrLines)


// input: {m,4} or {3.5ss,t1,h1,cs}; output: {staffpos:,  accidentals:[], tuplet: ....}
function getNoteDataProperties(str, beat_previous) {
    let data = {}
    let staffpos, accidentals, tuplet, tiestart, tieend, finger, beat, dot, beam 
    let _arr = str.split(',')
    _arr.forEach((d, i) => {
        // if i = 0, the d contains staffpos and accidental symbole
        if (i === 0) {
            staffpos = parseFloat(d)
            accidentals = d.toLowerCase().trim().replace(/[0-9]/g, '')
            accidentals = accidentals.replace('.', '')
            accidentals = accidentals.replace('m', '')
        } else {
            // a tie start contains 'ts' or 'TS'
            if (d.toLowerCase().indexOf('ts') > -1) { tiestart = d.trim().toLowerCase() }
            // a tie end contains 'te' or 'TE'
            else if (d.toLowerCase().indexOf('te') > -1) { tieend = d.trim().toLowerCase() }
            // a dot request contains 'd' or 'D'
            else if (d.toLowerCase().indexOf('d') > -1) { dot = d.trim().toLowerCase() }
            // a tuplet contains 't' or 'T'
            else if (d.toLowerCase().indexOf('t') > -1) { tuplet = d.trim().toLowerCase() }
            // a finger start contains 'f' or 'F'
            else if (d.toLowerCase().indexOf('f') > -1 && i > 0) { 
                let fingerstr=d.trim().toLowerCase().replace('f', '')
                finger = fingerstr
            }
            // a 'b' indicates beam needed
            else if (d.trim().toLowerCase() === 'b') {beam = 1 } 
            // or a beat, which is the second element without any letter
            else if (i === 1) {
                // console.log(d)
                 if( d && d.trim().length>0 ) { beat = d; } else {beat = beat_previous }
            }

        }// if-else i ===0 
    })
    data.staffpos = staffpos
    data.accidentals = accidentals
    data.tuplet = tuplet
    data.tiestart = tiestart
    data.tieend = tieend
    data.finger = finger
    data.beam = beam
    if (tuplet) {
        let tupletbeat = parseFloat(tuplet.replace('t', ''))
        // console.log(tupletbeat)
        data.beat = tupletbeat / 3 // it is indeed a bug in vex flow
    } else {
        data.beat = beat ? parseFloat(beat) : beat_previous
    }
    data.dot = dot
    // console.log(data)
    return data
} // function getNoteDataProperties(str)



 //input: staffposition =2.5, letternumber for staff line 1 = 69 ; output: letternumber = 72   
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

//5. according to the staffpos, get tone letter and octaveN
function staffposToTone(h) {

    let letternum, toneletter, octaveN
    // determine the letternumber corresponding to the first staff line of the clef (i.e., for treble: 69, bass:71)
    let letternumber_staffline1 = letternumber_for_staffposition1[h.clef]

    // determine the letternum (the letternumber to represent the tone leber and octave level)if staffpos is NaN, it is a rest note, keep the letternum as NaN
    if (isNaN(h.data.staffpos)) { letternum = h.data.staffpos } // NaN is for those rest moments that do not play any tone
    else { letternum = staffpositionToLetterNumber(h.data.staffpos, letternumber_staffline1) }
    
    // console.log(letternum)
    if (isNaN(letternum)) { toneletter = 'R' } else { toneletter = NumToToneLetter(letternum, anchor_A, n_tone_letters) }
    if (isNaN(letternum)) { octaveN = 0;}
    else {
        octaveN = parseInt((letternum - 67) / 7) + octaveChangeBase[h.clef]
       }
    // console.log("octaveN:", octaveN)
    h.data.toneletter = toneletter
    h.data.octave = octaveN
    h.data.letternum = letternum
    return h
} // staffposToTone()


//4. for each note, make a standard data obj, i.e., determine the staffpos, tone, accidental, beat, and additional properties (tuplet, tie, finger to play)
function makeStdNoteData_each(dataStr_eachnote){
    dataStr_eachnote.forEach((h,i) => {
        let thestr = h.str, beat_previous
        // console.log(h.str)
        // identify the staff line position, accidental, beat, tuplet, tie, finger, etc
        if (i>0){beat_previous = dataStr_eachnote[i-1].data.beat}
        h.data = getNoteDataProperties(h.str, beat_previous)
        // console.log(h)
        //5. add tone letter and octaveN
        h = staffposToTone(h)
    }) // dataStr_eachnote.forEach

    return dataStr_eachnote
} //makeStdNoteData_each(dataStr_eachnote)


// 2. loop for each clef, make stand data point
function convertToStdNotes(notesdate_clefs){
    let result =[]
    notesdate_clefs.forEach(d => {
        // 1. get note text and clef
        let notesdata_theclef = d.text
        let theclef = d.clef

        // 2. read each line of the data, record line number and bar number (by empty lines)
        // input: {text: `...`}
        // output: {clef:'treble', str'..', dataline: 2, bar: 2}
        let noteStrLines = makeNoteStrLines(notesdata_theclef, theclef)

        //3. loop for each str line, split and get data of individual notes 
        // input: [{clef:.., str:'3.5,1 ; 4,1}] (notes splitted by ;)
        // output: [{clef:.., str:'3.5,1 }, {clef:.., str:' 4,1}]
        let dataStr_eachnote = getDataEachNote(noteStrLines)

        //4. for each note, make a standard data obj, i.e., determine the staffpos, tone, accidental, beat, and additional properties (tuplet, tie, finger to play)
        let stddata_eachnote = makeStdNoteData_each(dataStr_eachnote)

        result.push({clef: theclef, contents:stddata_eachnote})        
    }) //  notesdate_clefs.forEach
    return result
} // convertToStdNotes
