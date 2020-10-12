
// (async () => {

//     // let pianoSynth =await Synth.createInstrument('piano');

// theletter, the section (octave number), and the length
// pianoSynth.play('C#', 3, 3);
let toneletter, octaveN;
let semi = "", seconds = 5;
// console.log(d3.selectAll('rect.keyrect'))
d3.selectAll('rect.keyrect')
    .on('click', function (ev) {
        console.log(ev)
        ev.preventDefault()
        ev.stopPropagation()

        console.log(ev)
        let id = ev.target.id
        let tonestr = id.substr(4, id.length)
        console.log(id, tonestr.length)
        if (tonestr.length === 2) {
            toneletter = tonestr.substr(0, 1)
            octaveN = tonestr.substr(1, 1)
        } 
        if (tonestr.length > 2){
            toneletter = tonestr.substr(0,1)
            semitoneletter = tonestr.substr(1,1)
            if (semitoneletter === 's'){semi='#'}
            octaveN = tonestr.substr(2,1)
        } 
        var key = toneletter + semi
        console.log(key, octaveN, seconds)

            let pianoSynth = Synth.createInstrument('piano');
            console.log(key)
            pianoSynth.play(key, parseInt(octaveN), seconds);
    })


// })()
