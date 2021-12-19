

// prepare notes for tonejs. The key is to set start time for each note
// it has to be done by clef
function prepareNotesforTonejsByClef(theSong) {

    // notes in theSong is like (clef, measure, stavenotenumber, momentorder, and notes:{clef, data, dom, etc})
    // for playing sound by tonejs, the ntoes should be ordered and arranged as 
    // [{measure, momentorder, notes{}, clef, stavenotenumber}] to be used by prepareNotesforTonejs. i.e., clef and stavenote number does not really matter here

    // console.log(sortedNotesInSong)

    // the idea is to get 
    // 1) for each moment, the minimal duration (# of seconds based on # of beats) of notes starting at the same time. This is to determine when the next moment should start
    // 2) for each note, the duration (# of seconds based on # of beats) to play

    let momentStartTime = 0, minDurationOfthePreMoment = 0
    for (let i = 0; i < theSong.length; i++) {
        let d = theSong[i]
        let tmp = {}
        let durationSeconds = parseFloat(d.data.beat) * (60 / quarternotesperminute)

        if (i === 0) {
            minDurationOfthePreMoment = durationSeconds
        }

        if (i > 0) {
            // if a new moment starts
            if (theSong[i - 1].momentid !== d.momentid) {
                // console.log('@@@ a new moment', i)
                momentStartTime = momentStartTime + minDurationOfthePreMoment
                minDurationOfthePreMoment = durationSeconds
            } else {
                minDurationOfthePreMoment = Math.min(minDurationOfthePreMoment, durationSeconds)
            } // if a new moment
        } // when i > 0


        tmp.accidentals = ''
        if (d.data.accidentals && ['#', 's'].includes(d.data.accidentals)) { tmp.accidentals = '#' }
        if (d.data.accidentals && ['b', 'f'].includes(d.data.accidentals)) { tmp.accidentals = 'b' }
        tmp.toneletter = d.data.toneletter
        tmp.octave = d.data.octave
        tmp.tone = tmp.toneletter + tmp.accidentals + tmp.octave
        tmp.beat = d.data.beat
        tmp.durationSeconds = durationSeconds
        tmp.staffpos = d.data.staffpos
        tmp.dataline = d.data.dataline
        tmp.startTime = momentStartTime

        d.tonejsdata = tmp

        // // tmp.startTime = momentStartTime  
        // console.log('==========', d.data.clef, d.data.toneletter, d.data.octave,
        //     'momentid:', d.momentid, 'momentStartTime:', momentStartTime,
        //     'minDurationOfthePreMoment:', minDurationOfthePreMoment, tmp
        // )

    } // for each note starting from i=1

    return theSong
} //prepareNotesforTonejsByClef

function prepareNotesforTonejs(theSong) {
    // has to separate by clefs
    let theSong_treble = [], theSong_bass = []

    theSong.forEach(d => {
        if (d.clef === 'treble') {
            theSong_treble.push(d)
        }
        if (d.clef === 'bass') {
            theSong_bass.push(d)
        }
    }) // split

    // prepare notes to be played by tone.js 
    theSong_treble = prepareNotesforTonejsByClef(theSong_treble)
    theSong_bass = prepareNotesforTonejsByClef(theSong_bass)

    theSong = theSong_treble.concat(theSong_bass)
    theSong = theSong.sort((a, b) => (a.momentid > b.momentid) ? 1 : -1)
    return theSong
}; // prepareNotesforTonejs()


// Tone.Sampler to play poly sound file (e.g., c4.mp3)
async function myPlayPolySample3(baseUrl, samples, notesToPlay) {
    // must state it here, as sampler.dispose() or sampler.disconnect() will empty the notes buffered by sampler

    sampler = new Tone.Sampler({
        urls: samples,
        release: 1, // what is it for
        baseUrl: baseUrl,
    }).toDestination();

    Tone.loaded().then(() => {
        Tone.context.resume().then(() => {
            const time0 = Tone.now()
            notesToPlay.forEach(h => {
                // console.log(h)
                sampler.triggerAttackRelease([h.tone], h.durationSeconds, time0 + h.startTime);
            })
            // it'll automatically pitch shift the samples to fill in gaps between notes! In this example there is no sample for C2, but Tone.Sampler will calculate it (do not even need the mp3)
        }) // Tone.context.resume()
    }) // Tone.loaded()

}; //


async function ClickToPlaySong(theSong, staveNoteGroups) {


    // console.log(staveNoteGroups)
    d3.select('button#playbutton') // .append('button').text('play the song').styles({ 'margin-top': '30px' })
        .on('click', async function () {

            // get the value and speed
            var theMeasuresToPlay = []
            let MeasureStart = parseInt(d3.select('input#start').node().value) // heck! d3 still cannot get value of input selector
            let MeasureEnd = parseInt(d3.select('input#stop').node().value)
            quarternotesperminute = parseInt(d3.select('input#speed').node().value)
            let repeatTimes = parseInt(d3.select('input#repeat').node().value)

            // console.log(MeasureStart, MeasureEnd, quarternotesperminute)

            if (!MeasureStart) { MeasureStart = 0 }
            if (!MeasureEnd) { MeasureEnd = theSong.length - 1 }
            theSong.forEach(d => {
                if (d.measure >= MeasureStart && d.measure <= MeasureEnd) { theMeasuresToPlay.push(d) }
            })

            /************the following is to play sound by tonejs */
            theMeasuresToPlay = prepareNotesforTonejs(theMeasuresToPlay)


            //https://tonejs.github.io/
            // const synth = new Tone.PolySynth(Tone.Synth).toDestination();

            let notesToPlay = []
            theMeasuresToPlay.forEach(d => {
                // console.log(d)
                if (!d.tonejsdata.tone.includes('R')) {
                    notesToPlay.push(d.tonejsdata)
                }
            })

            // calculate the accumulative durations in secs
            let lengthOfPlay = theMeasuresToPlay[theMeasuresToPlay.length - 1].tonejsdata.startTime
                + theMeasuresToPlay[theMeasuresToPlay.length - 1].tonejsdata.durationSeconds
            // console.log(lengthOfPlay)

                        // console.log(notesToPlay)
            if (!repeatTimes) { repeatTimes = 1 }
            timeoutvars = new Array(repeatTimes)
            // console.log(timeoutvars.length)

            for (let i = 0; i < repeatTimes; i++) {
                timeoutvars[i] =setTimeout(async function () {
                    d3.select('input#showrepeat').attr('value', ()=>{return (i+1) + ' of ' + repeatTimes; })
                    await myPlayPolySample3(baseUrl, samples, notesToPlay)
                    await slideStavenotes(theMeasuresToPlay, staveNoteGroups)
                }, (lengthOfPlay + 3) * 1000 * i + 3000);                
            } // for

        }) // on clikc
}// AddClickToPlaySongButton


// move the stavenotes when playing the song
async function slideStavenotes(theMeasuresToPlay, staveNoteGroups) {
    // calculate the accumulative durations in secs
    let lengthOfPlay = theMeasuresToPlay[theMeasuresToPlay.length - 1].tonejsdata.startTime
        + theMeasuresToPlay[theMeasuresToPlay.length - 1].tonejsdata.durationSeconds
    // console.log(lengthOfPlay)

    // the start x and end x position of the measures
    // console.log($('div#bigdiv').width())
    let firstMeasure = theMeasuresToPlay[0]
    let startMeasureX = staveNoteGroups[firstMeasure.clef][firstMeasure.measure].measure.stave.bounds.x
    // console.log(startMeasureX)

    let lastMeasure = theMeasuresToPlay[theMeasuresToPlay.length - 1]
    let lastMeasureX = staveNoteGroups[lastMeasure.clef][lastMeasure.measure].measure.stave.bounds.x
        + staveNoteGroups[lastMeasure.clef][lastMeasure.measure].measure.stave.bounds.w
    let offsetDivWidth = $('div#bigdiv').width()
    // console.log(startMeasureX, offsetDivWidth/2)

    let biggStartX = startMeasureX - offsetDivWidth / 3
    let biggStopX = lastMeasureX - offsetDivWidth > biggStartX ? lastMeasureX - offsetDivWidth : biggStartX
    // console.log(biggStartX, biggStopX)

    d3.select('g#bigg').transition().duration(0).attr('transform', 'translate(' + -biggStartX + ', 0)')

    d3.select('g#bigg').transition().duration(lengthOfPlay * 1000).ease(d3.easeLinear)
        .attr('transform', 'translate(' + -biggStopX + ', 0)')

} //  slideStavenotes()