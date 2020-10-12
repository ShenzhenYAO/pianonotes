
// https://stackoverflow.com/questions/50281568/audiocontext-not-allowed-to-start-in-tonejs-chrome

async function onKeyPress(ev) {

    let toneletter, octaveN;
    let semi = "", seconds = 1;

    // console.log(ev)
    ev.preventDefault()
    ev.stopPropagation()

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
    var key = toneletter + semi
    console.log('play sound', key, octaveN, seconds)

    await playnote(toneletter, semi, octaveN, seconds)

} //onKeyPress

async function playnote(toneletter, semi, octaveN, seconds) {
    let keystr = toneletter + semi + octaveN;
    // await synth.triggerAttack(keystr, now)
    // // wait one second before triggering the release
    // await synth.triggerRelease(now + seconds)
    Tone.context.resume().then(() => {
        synth.triggerAttackRelease(keystr, (1/seconds)*4 + 'n');
        synth.context.resume()
        Tone.context.resume()
    });    
    
}