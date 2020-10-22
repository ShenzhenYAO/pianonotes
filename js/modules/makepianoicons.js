// make g elemnts, each corresponding to a stavenote unit (the notes to be played at the same time)
function makeMeasureGs(parentDom, data) {
    let measureGs = d3.select(parentDom).selectAll('g.measureg').data(data).enter()
        .append('g')
        .attr('class', 'measureg') // this g is for transform-translate the position of the  moment icon (a set of piano keys indication which keys to press)
        .attr('transform', (d, i) => {
            let x = 0
            // let x = momentdivdata.maxwidth * i + 20 * i // width of each icon plus 20 px for padding
            let y = 0
            let translateStr = 'translate(' + x + ',' + y + ')'
            return translateStr
        })
    return measureGs
} //makeMeasureGs


// add the notes to be placed at the same time, by clef
async function addPianoStaveUnits(measureGs) {

    measureGs.attr('transform', (d, i) => {
            let x = momentdivdata.maxwidth * i + 20 * i // width of each icon plus 20 px for padding
            let y = 100
            let translateStr = 'translate(' + x + ',' + y + ')'
            return translateStr
        })

    // the g.moments are moved horizontally according to the order of the displaynote moments
    let momentFO = measureGs.append('foreignObject')
        .attrs({ 'width': momentdivdata.maxwidth, 'height': momentdivdata.maxwidth * 1.5 }) // attr w/h are for the stupid Safari
        .styles({ 'width': momentdivdata.maxwidth + 'px', 'height': momentdivdata.maxwidth * 1.5 + 'px'})
        .attr('transform', d => {
            let y = stavedivdata.height * 1.2
            return 'translate(0, ' + y + ')'
        }) // move down for 200 px

    let momentdivs = momentFO
        .append('xhtml:div')
        .styles(momentdivdata.stdstyles)
        .attrs({ 'class': 'momentdiv' })
        .styles({ 'width': momentdivdata.maxwidth + 'px', 'height': (momentdivdata.maxwidth * 1.5) + 'px' })

    // add a set of moment svgs for the right hand icons
    let momentsvg = momentdivs.append('svg').attrs({ 'class': 'momentsvg'  }).styles({ "width": momentdivdata.maxwidth, 'height': momentdivdata.maxwidth * 1.5, 'background-color': 'white' })
    let inner_momentg = momentsvg.append('g').attrs({ 'class': 'inner_momentg' })

    return inner_momentg

} //addPianoStaveUnits



