
    


    
    
    function prepareNotesforTonejs(theSong) {

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

            if (i===0) {
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
    } //prepareNotesforTonejs


// Tone.Sampler to play poly sound file (e.g., c4.mp3)
async function myPlayPolySample3(urls, samples, baseUrl, notesToPlay) {
    const sampler = new Tone.Sampler({
        urls: samples,
        release: 10, // what is it for
        baseUrl: baseUrl,
    }).toDestination();
    Tone.loaded().then(() => {
        Tone.context.resume().then(() => {
            const now = Tone.now()
            notesToPlay.forEach(h => {
                // console.log(h)
                sampler.triggerAttackRelease([h.tone], h.durationSeconds, now + h.startTime);
            })
            // it'll automatically pitch shift the samples to fill in gaps between notes! In this example there is no sample for C2, but Tone.Sampler will calculate it (do not even need the mp3)
        }) // Tone.context.resume()
    }) // Tone.loaded()
} //