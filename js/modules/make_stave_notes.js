

function makeStaveNote(parentID, notes, clef) {

    // use a g element as the parent node of the vf stave components
    // so that it can be transform to fit the display window

    // identify the staveg obj and dom
    let staveg_d3xn = d3.select('#' + parentID)
    let staveg_dom = staveg_d3xn.node()

    // VF to add an SVG within the parent G
    let renderer = new VF.Renderer(staveg_dom, VF.Renderer.Backends.SVG);

    // resize, make it high enough for vertical space (some nodes need to be above or below the staff lines)
    renderer.resize(200, 200);

    // let inner_stavesv_d3xn = d3.select(staveg).select('svg')
    // the following does not work
    // inner_stavesv_d3xn.styles({ 'background-color':  "yellow", 'border': 'solid 1px', 'width':'200px', 'height':'200px' })

    // do not know what it is for, getContext()...
    let context = renderer.getContext();

    // Create a stave at position 0, 10 of width 102 on the canvas
    // This is the normal position for a stave (without adjustment for over high/low notes)
    let stave = new VF.Stave(0, 0, 500)

    // stave.addClef("treble").addTimeSignature("4/4");
    // the following draws the staff line (the empty stave)
    stave.setContext(context).draw();

    // define the notes to be plotted in the stave system
    let convertedNotes = []
    // console.log(notes)
    convertedNotes = convertTones(notes, convertedNotes)
    // console.log(convertedNotes)

    // add convertedNotes
    let voices = []
    convertedNotes.forEach(d => {
        // console.log(d)
        let thevoice = new VF.StaveNote({ clef: clef, keys: d.keys, duration: d.duration })
        if (d.accidentals.length > 0) {
            d.accidentals.forEach(e => {
                thevoice.addAccidental(e.index, new VF.Accidental(e.symbol))
            })
        } // if 
        voices.push(thevoice)
    }) // convertedNotes.forEach

    // console.log(convertedNotes)

    // Create a voice in 4/4 and add the notes from above
    let voice = new VF.Voice({ num_beats: convertedNotes[0].maxbeats, beat_value: 4 });
    voice.addTickables(voices);

    // Format and justify the notes to 400 pixels. // no idea what is it for
    let formatter = new VF.Formatter().joinVoices([voice]).format([voice], 300);

    // Render voice
    voice.draw(context, stave);

   // get the line 1 and line 5, check note's position. no change if all notes within line 1 and line5
    // scale if the total height (line1, link5, and the note ) exceeds the height betwen line1 and line5
    let staffline1Ystr1 = staveg_d3xn.select('svg').select('path').attr('d').split('M')[1]
    let staffline1Y = parseInt(staffline1Ystr1.split(' ')[1])
    // console.log(staffline1Y)
    let staffline5Ystr1 = d3.select(staveg_d3xn.select('svg').selectAll('path').nodes()[4]).attr('d').split('M')[1]
    let staffline5Y = parseInt(staffline5Ystr1.split(' ')[1])
    // console.log(staffline5Y)

     // get the highest and lowest node, so as to determine the transform of the stave
    let noteheads_d3xn = staveg_d3xn.selectAll('g.vf-notehead')
    let noteheads_doms = noteheads_d3xn.nodes()
    // console.log(noteheads_doms)
    let minY = staffline1Y, maxY = staffline5Y
    noteheads_doms.forEach(d => {
        let thehead_d3xn = d3.select(d).select('path')
        let thepathd = thehead_d3xn.attr('d')
// console.log(thepathd)
        // the y position of the head is like 90 in the str M30 90M30..
        let thestr1 = thepathd.split('M')[1]
        let theY = parseInt(thestr1.split(' ')[1])
        // console.log(theY)
        minY = Math.min(minY, theY)
        maxY = Math.max(maxY, theY)
    })

    // console.log(minY, maxY)

    let scale = 25 /(maxY - minY) 
    // off set the staveg
    let x = -2 * scale, y = -15 *scale
    // console.log(x,y,scale)
    // offset for over high/low notes, change scale for both over high and over low notes
    staveg_d3xn.attr('transform', d => {
        return 'translate(' + x + ',' + y + ')scale(' + scale + ')'
    })
} // function makeStaveNote


function convertTones(notes, convertedNotes) {
    let keys = [], accidentals = [], minbeats = 999, maxbeats = 0, notesleft = [], durationstr
    notes.forEach((d, i) => {
        // 1. keys
        // get keys (from like F#5 or E4, to F#/5, and E/4)
        if (d.tone.length === 3) {
            let tmpstr = d.tone.substr(0, 2) + '/' + d.tone.substr(2, 1)
            keys.push(tmpstr)
            accidentals.push({ index: i, symbol: d.tone.substr(1, 1) })
        } else {
            let tmpstr = d.tone.substr(0, 1) + '/' + d.tone.substr(1, 1)
            keys.push(tmpstr)
        } // if(d.tone.length === 3) 

        // 2. duration
        let tmpbeat = d.beat
        minbeats = Math.min(minbeats, tmpbeat)
        maxbeats = Math.max(maxbeats, tmpbeat)
        // console.log(minbeats)
        if (minbeats === 1.5 || minbeats === 0.6 || minbeats === 0.8 || minbeats === 0.8) {minbeats=1; } // bug here, need to deal with the dot situation...
        if (minbeats === 3.5) {minbeats=2}
        let durationnum = (1 / minbeats) * 4
        // console.log(durationnum)
        // if (durationnum > 1000) {console.log(notes); return;} 
        durationstr = durationnum.toString()
        // console.log(durationstr)
        // 3. if there are remaining beat, carry over to the next run
        if (d.beat - minbeats > 0) {
            notesleft.push({ tone: d.tone, beat: d.beat - minbeats })
        }

    }) // notes.forEach

    let result = { keys: keys, accidentals: accidentals, duration: durationstr, maxbeats: maxbeats }
    convertedNotes.push(result)
    // console.log(convertedNotes)

    // if there is remaining beats, do it again
    if (notesleft.length > 0) { convertedNotes = convertTones(notesleft, convertedNotes) }

    return convertedNotes

} // convertTones(notes)