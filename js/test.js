const vf = new Vex.Flow.Factory({ renderer: { elementId: 'testdiv' } });
const score = vf.EasyScore();
const system = vf.System();


(async => {


    test()
    // the svg inside the box is set to have fixed height only fit for one clef.
    d3.select('div#testdiv').styles({ 'height': '50%', 'width': '50%', 'resize': 'both', 'overflow': 'auto' }).select('svg').styles({ 'height': '100%', 'width': '100%' }).attrs({ 'height': '100%', 'width': '100%' })



})()





function test() {
    // Create an SVG renderer and attach it to the DIV element named "boo".
    system.addStave({

        voices: [
            score.voice(score.notes('(Cb5 D5 E5)/q, B4, A4, G#4'), { stem: 'up' }),
            score.voice(score.notes('C#4/h, C#4', { stem: 'down' }))
        ]
    }).addClef('treble').addTimeSignature('4/4');

    system.addStave({
        voices: [
            score.voice(score.notes('C#3/q, B2, A2/8, B2, C#3, D3', { clef: 'bass', stem: 'up' })),
            score.voice(score.notes('C#2/h, C#2', { clef: 'bass', stem: 'down' }))
        ]
    }).addClef('bass').addTimeSignature('4/4');

    system.addConnector()

    vf.draw();

} // add SingleNotes


function addSingleVoice() {
    // https://github.com/0xfe/vexflow/wiki/Using-EasyScore
    //https://github.com/0xfe/vexflow/wiki/Using-EasyScore#lets-go
    // music sheet signs and symbols https://en.wikipedia.org/wiki/List_of_musical_symbols

    // Create an SVG renderer and attach it to the DIV element named "boo".
    system.addStave({
        voices: [score.voice(score.notes('C#5/q, B4, A4, G#4'))]
    }).addClef('treble').addTimeSignature('4/4');

    vf.draw();
} // add SingleNotes

function addPolyVoice() {
    // https://github.com/0xfe/vexflow/wiki/Using-EasyScore
    //https://github.com/0xfe/vexflow/wiki/Using-EasyScore#lets-go


    // Create an SVG renderer and attach it to the DIV element named "boo".
    system.addStave({
        voices: [
            score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' })),
            score.voice(score.notes('C#4/h, C#4', { stem: 'down' }))
        ]
    }).addClef('treble').addTimeSignature('4/4');

    vf.draw();
} // add SingleNotes


function addPolyClefs() {
    // https://github.com/0xfe/vexflow/wiki/Using-EasyScore
    //https://github.com/0xfe/vexflow/wiki/Using-EasyScore#lets-go

    system.addStave({
        voices: [
            score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' })),
            score.voice(score.notes('C#4/h, C#4', { stem: 'down' }))
        ]
    }).addClef('treble').addTimeSignature('4/4');

    system.addStave({
        voices: [
            score.voice(score.notes('C#3/q, B2, A2/8, B2, C#3, D3', { clef: 'bass', stem: 'up' })),
            score.voice(score.notes('C#2/h, C#2', { clef: 'bass', stem: 'down' }))
        ]
    }).addClef('bass').addTimeSignature('4/4');

    system.addConnector()

    vf.draw()
}
