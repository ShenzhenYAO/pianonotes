// combine data with measures

function makeMeasureGs(parentDom, data){
    let measureGs = d3.select(parentDom).selectAll('g.measureg').data(data).enter()
    .append('g')
    .attr('class', 'measureg') // this g is for transform-translate the position of the  moment icon (a set of piano keys indication which keys to press)
    .attr('transform', (d, i) => {
        let x=0
        // let x = momentdivdata.maxwidth * i + 20 * i // width of each icon plus 20 px for padding
        let y = 0
        let translateStr = 'translate(' + x + ',' + y + ')'
        return translateStr
    })
    return measureGs
} //makeMeasureGs
