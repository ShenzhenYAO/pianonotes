// https://tonejs.github.io/

const quarternotesperminute = 105 //76 * 1.5

// const synth = new Tone.Synth().toDestination(); // when play samples, do not need to load Synth or polySynth

d3.select('div#bigdiv').append('button').text('play the song').styles({'margin-top': '30px'})
    .on('click', async function () {

    //https://tonejs.github.io/
    // const synth = new Tone.PolySynth(Tone.Synth).toDestination();

    // get slices of nodes to play
    notes = getNotesToDisplay(allnotes, 0, 200)
    // console.log(notes)
 
    let notesToPlay = prepareNotes(notes)
    // console.log(notesToPlay)

    // let note = { toneletter: 'C', semi: '', octave: 4, beat: 1 }
    // await playAnoteAttackRelease(note)
    // await playAnoteAttackThenRelease(note)

    // let notes = [
    //     { toneletter: 'C', semi: '', octave: 4, beat: 1 },
    //     { toneletter: 'E', semi: '', octave: 4, beat: 1 },
    //     { toneletter: 'G', semi: '', octave: 4, beat: 1 },
    //     { toneletter: 'C', semi: '', octave: 5, beat: 1 }
    // ]
    // await playPolyNotes(notes)

    // play an mp3 sample
    // let url = 'data/instruments/piano/c4.mp3'
    // playSample(url)

    // play multipy mp3 samples
    // let urls=['whatever']
    // playPolySample(urls)

    // let urls = ['whatever']
    // myPlayPolySample1(urls)

    // let urls = ['whatever']
    // myPlayPolySample2(urls)

    let urls = ['whatever']
    let baseUrl = 'data/instruments/piano/'
    let samples = {
        "C4": "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
    }

    // let baseUrl = 'externaltools/tone_instruments/samples/harmonium/'
    // let samples = {
    //     "A3": "A3.mp3",
    //     "A#3": "As3.mp3",
    //     "C4": "C4.mp3",
    //     "E3": "E3.mp3",
    //     "F#2": "Fs2.mp3",
    // }
    
    
    myPlayPolySample3(urls, samples, baseUrl, notesToPlay)
})



function prepareNotes(notes) {
    // left head

    let results = [] // each record is to have: the tone (e.g. C4), duration in seconds, and start time since now()
    let momentStartTime = 0
    notes.forEach((d, i) => {
        // get the clefs
        let clefs = Object.keys(d)
        // loop for each key
        let minDuration = 999
        clefs.forEach((e, j) => {
            // console.log(e) // left, right
            let notesInAClef = d[e]
            // console.log(notesInAClef)
            // loop for each notes in a Clef 

            notesInAClef.forEach((g, k) => {
                // console.log(g)                
                let tmp = {}
                tmp.moment = i
                tmp.staff = g.staffpos
                tmp.tone = g.tone
                tmp.beat = g.beat
                tmp.dataline = g.dataline
                tmp.durationSeconds = parseFloat(g.beat) * (60 / quarternotesperminute)
                minDuration = Math.min(minDuration, tmp.durationSeconds)
                tmp.startTime = momentStartTime
                tmp.clef = e
                tmp.note = k
                // console.log(g.tone)
                // do not push the 'R0' into the play list
                if (g.tone !== 'R0') { results.push(tmp) }

            })

        })
        // update the startTime
        momentStartTime = momentStartTime + minDuration
    })

    return results
} //prepareNotes


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


// Tone.Sampler to play poly sound file (e.g., c4.mp3)
async function myPlayPolySample2(urls) {
    const sampler = new Tone.Sampler({
        urls: {
            "C4": "C4.mp3",
            "D#4": "Ds4.mp3",
            "F#4": "Fs4.mp3",
            "A4": "A4.mp3",
        },
        release: 1,
        baseUrl: "data/instruments/piano/",
    }).toDestination();
    Tone.loaded().then(() => {
        Tone.context.resume().then(() => {
            const now = Tone.now()
            sampler.triggerAttackRelease(["E4"], 1, now);
            sampler.triggerAttackRelease(["C5"], 2, now + 1);
            sampler.triggerAttackRelease(["A3"], 0.3, now + 1);
            sampler.triggerAttackRelease(["C4"], 0.3, now + 1 + 0.3);
            sampler.triggerAttackRelease(["A3"], 0.4, now + 1 + 0.6);

            sampler.triggerAttackRelease(["A4"], 1, now + 2);

            sampler.triggerAttackRelease(["D5"], 0.3, now + 3);
            sampler.triggerAttackRelease(["F3", 'A3'], 1, now + 3);
            sampler.triggerAttackRelease(["C5"], 0.3, now + 3 + 0.3);
            sampler.triggerAttackRelease(["B4"], 0.4, now + 3 + 0.3 + 0.3);

            sampler.triggerAttackRelease(["C5"], 1, now + 4);
            sampler.triggerAttackRelease(["E3"], 2, now + 4);

            sampler.triggerAttackRelease(["A4"], 1, now + 5);


            // it'll automatically pitch shift the samples to fill in gaps between notes! In this example there is no sample for C2, but Tone.Sampler will calculate it (do not even need the mp3)
        }) // Tone.context.resume()
    }) // Tone.loaded()
} //


// Tone.Sampler to play poly sound file (e.g., c4.mp3)
// 
async function myPlayPolySample1(urls) {
    const sampler = new Tone.Sampler({
        urls: {
            "C4": "C4.mp3",
            "D#4": "Ds4.mp3",
            "F#4": "Fs4.mp3",
            "A4": "A4.mp3",
        },
        release: 1,
        baseUrl: "data/instruments/piano/",
    }).toDestination();
    Tone.loaded().then(() => {
        Tone.context.resume().then(() => {
            const now = Tone.now()
            sampler.triggerAttackRelease(["C2", "G4"], 4, now);
            sampler.triggerAttackRelease(["G4", "C5"], 2, now + 2);
            // it'll automatically pitch shift the samples to fill in gaps between notes! In this example there is no sample for C2, but Tone.Sampler will calculate it (do not even need the mp3)
        }) // Tone.context.resume()
    }) // Tone.loaded()
} //



// Tone.Sampler to play poly sound file (e.g., c4.mp3)
async function playPolySample(urls) {
    const sampler = new Tone.Sampler({
        urls: {
            "C4": "C4.mp3",
            "D#4": "Ds4.mp3",
            "F#4": "Fs4.mp3",
            "A4": "A4.mp3",
        },
        release: 1,
        baseUrl: "data/instruments/piano/",
    }).toDestination();

    Tone.loaded().then(() => {
        sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 4); // it'll automatically pitch shift the samples to fill in gaps between notes! In this example there is no sample for Bb4, but Tone.Sampler will find it! (it just calcualte the names, the mp3 files has to be prepared in the same folder)
    })
} //


// Tone.Player to play a single sound file (e.g., c4.mp3)
async function playSample(url) {
    const player = new Tone.Player(url).toDestination();
    Tone.loaded().then(() => {
        player.start();
    });
}


//play a serial of sounds that start in different time (0.5 after the previous), and end at the same time (after 4 secs from now())
async function playPolyNotes(notes) {
    await Tone.start()
    const now = Tone.now() // must be set every time playing a note
    Tone.context.resume().then(() => {
        // loop to configure each note
        notes.forEach((d, i) => {
            let keystr = d.toneletter + d.semi + d.octave
            let starttime = now + i * 0.5
            let endtime = now + 4
            synth.triggerAttack(keystr, starttime)
            synth.triggerRelease(keystr, endtime)
        })
    });
} // playPolyNotes



//putthing together attack and release 
async function playAnoteAttackRelease(note) {
    let keystr = note.toneletter + note.semi + note.octave
    await Tone.start()
    const now = Tone.now() // must be set every time playing a note
    Tone.context.resume().then(() => {
        // e.g., 76 beats per minute, a beat is 60/76 seconds
        let seconds = note.beat / quarternotesperminute
        let timestr = seconds + 'n' // 1/8 n is the same as 8n ??? Confusing For example "4n" is a quarter-note, "8t" is an eighth-note triplet, and "1m" is one measure.
        console.log(keystr, timestr)
        // synth.triggerAttackRelease(keystr, timestr , now);
        synth.triggerAttackRelease(keystr, seconds, now); // why not just use seconds!
    });
} // playAnoteAttackRelease


//putthing together attack and release 
async function playAnoteAttackThenRelease(note) {
    let keystr = note.toneletter + note.semi + note.octave
    await Tone.start()
    const now = Tone.now() // must be set every time playing a note
    Tone.context.resume().then(() => {
        // e.g., 76 beats per minute, a beat is 60/76 seconds
        let seconds = note.beat / quarternotesperminute
        synth.triggerAttack(keystr, now);
        synth.triggerRelease(keystr, now + seconds) // it is better than '4n'.
    });
} // playAnoteAttackRelease



// https://stackoverflow.com/questions/50281568/audiocontext-not-allowed-to-start-in-tonejs-chrome
// https://tonejs.github.io/
// the key is to wait until resumed (Tone.context.resume())
async function playPressedKey(ev) {

    d3.select(ev.target).attr('fill', 'lightgrey')

    let toneletter, octaveN;
    let semi = ""

    // console.log(ev)
    let id = ev.target.id
    let tonestr = id.substr(4, id.length)
    // console.log(id, tonestr.length)

    if (tonestr.length === 2) {
        toneletter = tonestr.substr(0, 1)
        octaveN = tonestr.substr(1, 1)
    }
    if (tonestr.length > 2) {
        toneletter = tonestr.substr(0, 1)
        semitoneletter = tonestr.substr(1, 1)
        if (semitoneletter === 's') { semi = '#' }
        octaveN = tonestr.substr(2, 1)
    }
    var key = toneletter + semi + octaveN
    // console.log('play sound', key, octaveN)
    const baseUrl = 'data/instruments/piano/'
    const sampler = new Tone.Sampler({
        urls: {
            "C4": "C4.mp3",
            "D#4": "Ds4.mp3",
            "F#4": "Fs4.mp3",
            "A4": "A4.mp3",
        },
        release: 1, // what is it for
        baseUrl: baseUrl,
    }).toDestination();
    Tone.loaded().then(async function () {
        // console.log(key)
        await Tone.start()
        const now = Tone.now() // must be set every time playing a note
        Tone.context.resume().then(() => {
            // loop to configure each note
            sampler.triggerAttack(key, now)
            d3.select(ev.target).on('mouseup', async function () {
                // console.log('mouseup')
                sampler.triggerRelease(key, now)                
                d3.select(ev.target).attr('fill',  function (){ // async not work
                    // console.log(key.length)
                    if (key.length > 2) {
                        return 'black';
                    } else {
                        return 'white';
                    } // if
                }) // d3.select
            }) // d3.select(ev.target)
        }); // Tone.context.resum
    }) // Tone.loaded
} //onKeyPress