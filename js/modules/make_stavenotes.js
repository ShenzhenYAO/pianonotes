// =======. make a blank stave svg, which is the stage for all stave notes
// let parentDom = document.getElementById('staveg')
function makeStaveSvg(parentDom) {
    // 1. make the svg for staves
    let renderer = new VF.Renderer(parentDom, VF.Renderer.Backends.SVG);
    // resize, the stave svg
    renderer.resize(50000, 500);
    return renderer
} //function makeStaveSvg(parentDom)



// input: {clef:, dataline:, bar:, str, data...} // out: {vfdata: {clef: 'treble', keys: ['A/4'], duration: '8' }, origin: {same as input}}
// makevfnotedata(notedata)
// console.log(notedata.data.vfdata)
function makeVFNoteData(indata) {
    let dot, accidentals
    let clef = indata.clef
    let key = indata.data.toneletter + '/' + indata.data.octave
    let duration = 1 / indata.data.beat * (beatperquarternote * 4) // in general, the duration is determined by the beat value
    // however, if the beat is a multiple of 3 (e.g., 0.3, 0.6, 1.5, 3, etc), change the duration to 2/3 of beat, and add a dot
    if ((indata.data.beat * 1000000) / 3 === parseInt((indata.data.beat * 1000000) / 3)) {
        duration = 1 / (indata.data.beat * 2 / 3) * (beatperquarternote * 4)
        duration = duration.toString() + 'd'
        dot = 1
    }
    // also, for tuplets, the duration is 8 for t1, 16 for t0.5, etc
    if (indata.data.tuplet) {
        // wholeduration of the tuplets
        let beats_wholetuplet = parseFloat(indata.data.tuplet.replace('t', '')) // in beats
        duration = 1 / (beats_wholetuplet / 2) * (beatperquarternote * 4)
    } // if
    if (indata.data.accidentals.length > 0) {
        accidentals = indata.data.accidentals.replace(/s/g, '#')
        accidentals = accidentals.replace(/f/g, 'b')
    }
    
    indata.data.vfdata = {}
    indata.data.vfdata.dot = dot
    indata.data.vfdata.clef = clef
    indata.data.vfdata.key = key
    indata.data.vfdata.duration = duration.toString()
    // finally if toneletter is R, let key = b/4, and let duration like '8r'
    if (indata.data.toneletter === 'R') { 
        if (clef === 'treble') {        indata.data.vfdata.key='b/4'; }
        else {indata.data.vfdata.key='d/3'; }
        indata.data.vfdata.duration =duration.toString() + 'r'
     }
    indata.data.vfdata.accidentals = accidentals
    indata.data.vfdata.beam = indata.data.beam
    indata.data.vfdata.tuplet = indata.data.tuplet
    indata.data.vfdata.tiestart = indata.data.tiestart
    indata.data.vfdata.tieend = indata.data.tieend
    indata.data.vfdata.finger = indata.data.finger
    indata.data.vfdata.letternum = indata.data.letternum
    indata.data.vfdata.dataline = indata.dataline
    indata.data.vfdata.measure = indata.bar
    return indata
} // makevfnotedata

// input notes data
// output data with folded vf stave notes (each stavenote migh contain multiple notes of the same dataline, i.e., to be played at the same time)
function makeVFStaveNotes(stdnotesdata_clefs) {
    stdnotesdata_clefs.forEach(d => {
        let previousDataline, vftmp = {}
        d.vfnotes = []
        d.contents.forEach((e, i) => {
            // console.log(e)
            // for the first note, let the previous note's dataline = the current dataline
            if (i === 0) {
                previousDataline = e.dataline
                vftmp.dataline = e.dataline
                vftmp.clef = e.clef
                vftmp.duration = e.data.vfdata.duration.toString()
                vftmp.vfkeysdata = []
                vftmp.beam = e.data.vfdata.beam
                vftmp.tuplet = e.data.vfdata.tuplet
                vftmp.ties = { start: e.data.vfdata.tiestart, end: e.data.vfdata.tieend }
                vftmp.measure = e.data.vfdata.measure

            }
            if (previousDataline === e.dataline) {
                vftmp.vfkeysdata.push({ letternum: e.data.vfdata.letternum, key: e.data.vfdata.key, accidentals: e.data.vfdata.accidentals, dot: e.data.vfdata.dot, data: e.data })
                
                vftmp.vfkeys = vftmp.vfkeysdata.map(x => x.key)
                vftmp.vfaccidentals = vftmp.vfkeysdata.map(x => x.accidentals)
                vftmp.vfdots = vftmp.vfkeysdata.map(x => x.dot)
                vftmp.data = vftmp.vfkeysdata.map(x => x.data)           
            
            } else {
                // console.log(vftmp)
                // need to sort the keys by letter number, so that the key of lower level comes first
                // this is a must as VF will sort the keys anyway, and might mess up the order number of keys to add accidentals or dots
                vftmp.vfkeysdata = vftmp.vfkeysdata.sort(function (a, b) { return a.letternum - b.letternum })
                //get the sorted vfkeys
                vftmp.vfkeys = vftmp.vfkeysdata.map(x => x.key)
                vftmp.vfaccidentals = vftmp.vfkeysdata.map(x => x.accidentals)
                vftmp.vfdots = vftmp.vfkeysdata.map(x => x.dot)
                vftmp.data = vftmp.vfkeysdata.map(x => x.data)
                delete vftmp.vfkeysdata
                d.vfnotes.push(vftmp)
                vftmp = {}
                previousDataline = e.dataline
                vftmp.dataline = e.dataline
                vftmp.clef = e.clef
                vftmp.duration = e.data.vfdata.duration.toString()
                vftmp.vfkeysdata = [{ letternum: e.data.vfdata.letternum, key: e.data.vfdata.key, accidentals: e.data.vfdata.accidentals, dot: e.data.vfdata.dot, data: e.data }]
                vftmp.beam = e.data.vfdata.beam
                vftmp.tuplet = e.data.vfdata.tuplet
                vftmp.ties = { start: e.data.vfdata.tiestart, end: e.data.vfdata.tieend }
                vftmp.measure = e.data.vfdata.measure

                vftmp.vfkeys = vftmp.vfkeysdata.map(x => x.key)
                vftmp.vfaccidentals = vftmp.vfkeysdata.map(x => x.accidentals)
                vftmp.vfdots = vftmp.vfkeysdata.map(x => x.dot)
                vftmp.data = vftmp.vfkeysdata.map(x => x.data)
            }
        }) //d.contents forEach
        // push the last vfnotes, do not forget this!
        d.vfnotes.push(vftmp)

    })// stdnotesdata_clefs 

    return stdnotesdata_clefs

} //makeVFStaveNotes


// fold stavenotes by measures
function makeVFMeasures(stdnotesdata_clefs) {
    stdnotesdata_clefs.forEach((d, i) => {
        // d is, in a clef, collection of vfnotes (stavenotes, which are indeed multiple notes to be played at the same time)
        // get vfStavenotes within the same measure (bar)
        d.vfmeasures = []
        let tmp = {}, previousmeasure
        d.vfnotes.forEach((e, j) => {
            // console.log(e)
            if (j === 0) {
                previousmeasure = e.measure
                tmp.measure = e.measure
                tmp.vfnotes = []
            }
            if (previousmeasure === e.measure) {
                tmp.vfnotes.push(e)
            } else {
                d.vfmeasures.push(tmp)
                tmp = {}
                tmp.measure = e.measure
                previousmeasure = e.measure
                tmp.vfnotes = [e]
            }
        }) // each vfnotes
        // push the last measure 
        d.vfmeasures.push(tmp)
        delete d.vfnotes
    }) // each clef    
    return stdnotesdata_clefs
} // makeVFMeasures

// =======. make a blank stave
// let staveXYL = {x: 0, y:0, length:200}
//         let stave1_vfe = addBlankStave(staveSVG_vft, staveXYL,staveSettings.clef, staveSettings.timeSignature )
function addBlankStave(staveSVG_vft, staveBounds, clef, timeSignature, staveid) {
    //1. do not know what it is for, getContext()...
    let context = staveSVG_vft.getContext();
    // 2. define the stave 
    // a stave is for a bar, or a measure. In the following, it starts from x=0, y=0, with length of 500
    let stave
    if (staveBounds) { stave = new VF.Stave(staveBounds.x, staveBounds.y, staveBounds.w) } else {
        stave = new VF.Stave(0, 0, 500)
    } // if (staveXYL)

    // 3. add clef and time signature
    if (clef) { stave.addClef(clef) }
    if (timeSignature) { stave.addTimeSignature(timeSignature) };
    // 4. draw the staff line (the empty stave)
    stave.setContext(context).draw();
    if (staveid) { stave.attrs.id = staveid }
    return stave
}    // addBlankStave()

// convert it as [{measure: 0, treble:[vfnotes1, 2 ...], bass:}]
function makeVFMeasuresByClef(indata){
    let result = []
    indata.forEach(d=>{
        // console.log(d)
        let tmp={}
        tmp.measure = d[0].measure
        if(d[0]) {
            let key0 = d[0].vfnotes[0].clef 
        tmp[key0] = d[0].vfnotes
        }
        if(d[1]){
           let key1 = d[1].vfnotes[0].clef 
        tmp[key1] = d[1].vfnotes 
        }               
        result.push(tmp)
    }) // vfmeasures1 for each
    return result
} // makeVFMeasuresByClef()


// loop for each clef, and measure, draw stavenotes
// let vfstaves = addBlankStavesByClef(vfmeasures)
function addBlankStavesByClef(vfmeasures, staveSVG_vft ){
    let staveX = 0, staveY1 = 50, staveY2 = staveY1 + 300
    let staveWidth, vfstaves=[]
    vfmeasures.forEach((d, i) => {
        // console.log('==========', d.measure)
        //determine the stave width, which is the max length of treble/bass vfnotes
        let length_treblevfnotes = d.treble ? d.treble.length : 0
        let length_bassvfnotes = d.bass ? d.bass.length : 0
        let maxLength = Math.max(length_treblevfnotes, length_bassvfnotes)
        let staveBounds
        if (i === 0) {
            let tmp={}
            tmp.measure = d.measure
            staveWidth = 400 //(maxLength -1) * notespace, staveBounds
            staveBounds = { x: staveX, y: staveY1, w: staveWidth } 
            let staveid =  d.measure + '_' +  d.treble[0].clef
            tmp.treble = addBlankStave(staveSVG_vft, staveBounds, d.treble[0].clef, timeSignature, staveid)
            staveBounds = { x: staveX, y: staveY2, w: staveWidth }
            staveid =  d.measure + '_' +  d.bass[0].clef
            tmp.bass = addBlankStave(staveSVG_vft, staveBounds, d.bass[0].clef, timeSignature, staveid)
            vfstaves.push(tmp)
        } else {
            let timesig
            if (i ===2){timesig = '3/4'} else {timesig = null}
            let tmp={}
            tmp.measure = d.measure
            staveX = staveX + staveWidth // based on x and w of last time
            staveWidth = 400 // (maxLength -1) * notespace, staveBounds
            staveBounds = { x: staveX, y: staveY1, w: staveWidth }
            let staveid =  d.measure + '_' +  d.treble[0].clef
            tmp.treble =addBlankStave(staveSVG_vft, staveBounds, null, timesig, staveid)
            staveBounds = { x: staveX, y: staveY2, w: staveWidth }
            staveid =  d.measure + '_' +  d.bass[0].clef
            tmp.bass =addBlankStave(staveSVG_vft, staveBounds, null, timesig, staveid)
            vfstaves.push(tmp)
        }
    }) // each clef
    // console.log(vfstaves)
    return vfstaves
} // addBlankStavesByClef


// arrange vfnotes into a collection of vfstavenotes, indicate addAccidentals, dots, separate notes requiring beams or tuplets
// let vfnotes = vfmeasures[0].treble
// let stavenotes =  makeStaveNotes(vfnotes)
function makeStaveNotes(vfnotes) {

    let result = []
    let notegroupnumber = -1
    let prenotegrouptype = ''
    vfnotes.forEach(d => {
        // console.log(d)
        // make vfstavenotes
        // 1. make stavenotes
        let stavenote = new VF.StaveNote({ clef: d.clef, keys: d.vfkeys, duration: d.duration })
        // 2. add accidentals, there are multiple notes in a set of stavenote, each note in the stavenote may have different accidental setting
        if (d.vfaccidentals) {
            d.vfaccidentals.forEach((e, j) => {
                if (e) {stavenote.addAccidental(j, new VF.Accidental(e))}
            })
        } // if accidentals
        if (d.vfdots) {
            // console.log(d.vfdots)
            d.vfdots.forEach((e, j) => {
                if(e) {stavenote.addDot(j)}
            })
        } // if dots

        // insert _mydata into stavenote
        stavenote._mydata = d

        // classify notes into plain, beamed, or tuplet groups, with note group number
        let beamstr
        if (d.beam) {beamstr= d.beam.toString()}
        let curnotegrouptype = beamstr + d.tuplet
        // console.log(d, curnotegrouptype, prenotegrouptype)
        if (prenotegrouptype !== curnotegrouptype) {
            notegroupnumber++;
            prenotegrouptype = curnotegrouptype
        } // check note type  
        if (d.tuplet) {
            result.push({ notegroupnumber: notegroupnumber, notes: stavenote, beam: 1, tuplet: 1 })
        } else {
            if (d.beam) {
                result.push({ notegroupnumber: notegroupnumber, notes: stavenote, beam: 1 })
            } else {
                result.push({ notegroupnumber: notegroupnumber, notes: stavenote })
            } // if beam or plain
        } // if tuplet
    })
    return result
} // makeStaveNotesByType


// group stavenotes according to group number, indicate type of the group(plain, beam, or tuplet)
// let stavenotegroups = makeStaveNoteGroups(stavenotes)
function makeStaveNoteGroups(stavenotes){
    let notegroups =[], thenotegroup=[]
    let prenotegroupnumber = 0
    let beam, tuplet
    stavenotes.forEach(d=>{
        // console.log(d)
        if (prenotegroupnumber === d.notegroupnumber) {
            thenotegroup.push(d.notes)
            if (d.tuplet) {tuplet =1}
            if(d.beam) {beam=1}
        } else {
            prenotegroupnumber= d.notegroupnumber
            notegroups.push({notes: thenotegroup, beam: beam, tuplet:tuplet})
            thenotegroup =[d.notes]
            tuplet = d.tuplet
            beam = d.beam
        } // if notegroup number changes
    }) //for each stavenote
    // push the lastnotegroup 
    notegroups.push({notes: thenotegroup, beam: beam, tuplet:tuplet})
    // console.log(notegroups)
    return notegroups
} // makeStaveNoteGroups


// add notes, taking care of accidentals, dots, beams, tuplets, ties within measure. ties across measures are not correct
function makeAllStaveNotegroupsInAMeasure( thestave, notegroups, beatPerQuaterNote, setStrictOff) {

    // console.log(notegroups)

    let n_voices = 0, sumbeats = 0, beams = [], tuplets = [], allStaveNotes, tiestarts = [],
        tieends = [], voiceIndex = -1
    //0. by default, let beatPerQuaterNote =1 (one beat per quarternote)
    if (!beatPerQuaterNote) { beatPerQuaterNote = 1 }

    // loop for each notegroups, group all staveNote groups into allStaveNotes, also prepare beam/tuplets
    notegroups.forEach((d, i) => {

        let thenotegroup = d
        if (i === 0) {
            allStaveNotes = thenotegroup.notes
        } else {
            allStaveNotes = allStaveNotes.concat(thenotegroup.notes)
        }

        //1. accumulate the durations
        thenotegroup.notes.forEach((d, i) => {

            let adj_beats1 = 0 // it is a string
            // if dot=1, add 50% to d.duration, this vex flow is not great and need adjustment
            if (d._mydata.vfdots && d._mydata.vfdots[0] ){adj_beats1 = (4 * beatPerQuaterNote) / parseInt(d.duration) *1/2 }

            let adj_beats2=0
            // if tuplet=1, reduce 1/3 from the beat by d.duration, this vex flow is not great and need adjustment
            if (d._mydata.tuplet ){adj_beats2 = -(4 * beatPerQuaterNote) / parseInt(d.duration) *1/3 }

            voiceIndex++;
            // console.log(d.duration)
            sumbeats = sumbeats +  (4 * beatPerQuaterNote) / parseInt(d.duration) + adj_beats1 + adj_beats2
        })

        //check if to add beam
        if (thenotegroup.beam) {
            let beam = new VF.Beam(thenotegroup.notes)
            beams.push(beam)
        }
        // Create a voice in 4/4 and add the notes from above
        if (thenotegroup.tuplet) {
            let tuplet = new VF.Tuplet(thenotegroup.notes)
            tuplets.push(tuplet)
        }
        // check ties, the idea is to 
        if (thenotegroup.ties) {
            // console.log(thenotegroup.ties)
            if (thenotegroup.ties.start) {
                thenotegroup.ties.start.forEach(e => {
                    tiestarts.push(n_voices + e)
                })
            } //
            if (thenotegroup.ties.end) {
                thenotegroup.ties.end.forEach(e => {
                    // console.log(n_voices, e)
                    tieends.push(n_voices + e)
                })
            } //
        }
        n_voices = n_voices + thenotegroup.notes.length
    }) //notegroups.forEach

    //2. define the number of beats, and beat value in a measure
    let measure_vfe = new VF.Voice({ num_beats: sumbeats, beat_value: (4 * beatPerQuaterNote) }); // 1 beat in a measure (bar), a quarter note (4) as a beat
    // console.log(measure_vfe) // this is confusing. measure is also named 'e' of vf object

    // console.log(allStaveNotes)

    //3. voice.addTickables(voices.concat(voices2)).setStrict(false);
    measure_vfe.addTickables(allStaveNotes)

    //4. determien whether to turn off the setStrict(). When turned off, VF does not report error and stop even if there is no enough beats in a measure (bar). However, if there are too many beats than a bar should have, VF will report error and halter
    if (setStrictOff) { measure_vfe.setStrict(false) }

    // add my node data to it
    allStaveNotes.forEach((d, i)=>{
        d.attrs.id = thestave.attrs.id + '_' + i
    })

    return {allgroups:allStaveNotes, measure:measure_vfe, tuplets:tuplets, beams:beams }

} //makeAllStaveNotegroupsInAMeasure
