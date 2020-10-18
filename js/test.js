// https://github.com/0xfe/vexflow/wiki/The-VexFlow-Tutorial

// const vf = new Vex.Flow.Factory({ renderer: { elementId: 'stavediv_right_1' } });
// const score = vf.EasyScore();
// const system = vf.System();



(async => {
    test1()
})()

async function test1() {

    // let thestavesvg = d3.select('svg#stavesvg_right_1')
    // thestavesvg.styles({ 'width': '500px', 'height': '500px' })
    // d3.select(thestavesvg.node().parentNode).styles({ 'width': '500px', 'height': '500px' })

    let thestaveg_d3xn = d3.select('g#staveg_right_1')
    // console.log(thestaveg_d3xn.datum())

    let parentID = 'staveg_right_1'
    let clef = 'right'
    let notes = thestaveg_d3xn.datum()[clef]
    // console.log(notes)
    makeStaveNote(parentID, notes)

} //test1


