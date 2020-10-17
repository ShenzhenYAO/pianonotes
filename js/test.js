// https://github.com/0xfe/vexflow/wiki/The-VexFlow-Tutorial

const vf = new Vex.Flow.Factory({ renderer: { elementId: 'stavediv_right_1' } });
VF = Vex.Flow;
const score = vf.EasyScore();
const system = vf.System();

(async => {
     test1()
})()

async function test1() {

    let thediv = d3.select('div#stavediv_right_1')
    thediv.styles({'width':'500px', 'height':'500px'})
    d3.select(thediv.node().parentNode).styles({'width':'500px', 'height':'500px'})

    let thesvg = d3.select('svg#stavesvg_right_1')

    let thedivdata = thediv.datum()
    console.log(thedivdata.right[0].tone, thedivdata.right[0].beat)

    let thenote = thedivdata.right[0].tone + '/q'

    // system.addStave({
    //     voices: [score.voice(score.notes('A4/q, B4, A4, B5'), { clef: 'treble', timesignature: '1/4',})]
    // })

    // Create an SVG renderer and attach it to the DIV element named "boo".



var renderer = new VF.Renderer(thesvg.node(), VF.Renderer.Backends.SVG);

// Size our SVG:
renderer.resize(200, 200);

// And get a drawing context:
var context = renderer.getContext();

var stave = new VF.Stave(10, 40, 400);


// // And get a drawing context:
// var notes = [
//     // A quarter-note C.
//     new VF.StaveNote({clef: "treble", keys: ["c/4"], duration: "q" }),
  
//     // A quarter-note D.
//     new VF.StaveNote({clef: "treble", keys: ["d/4"], duration: "q" }),
  
//     // A quarter-note rest. Note that the key (b/4) specifies the vertical
//     // position of the rest.
//     new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr" }),
  
//     // A C-Major chord.
//     new VF.StaveNote({clef: "treble", keys: ["c/4", "e/4", "g/4"], duration: "q" })
//   ];
  
//   // Create a voice in 4/4 and add the notes from above
//   var voice = new VF.Voice({num_beats: 4,  beat_value: 4});
//   voice.addTickables(notes);
  
//   // Format and justify the notes to 400 pixels.
//   var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
  
//   // Render voice
//   voice.draw(context, stave);




    // thediv.select('svg').styles({'width':'200px', 'height':'100px'})
    // .attrs({'width':'200', 'height':'100', 'viewbox':'0 0 200 100'})

    // d3.select(thediv.node().parentNode.parentNode).attr('transform', 'translate(0, -10)')

}


