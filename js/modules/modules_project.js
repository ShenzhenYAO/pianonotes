function makeInputDoms() {
    let inputdiv_d3xn = d3.select('body').append('div').attr('id', 'inputdiv').attr('class', 'inputdivs')

    inputdiv_d3xn.append('div').text('start from').attr('class', 'inputdivs')
    inputdiv_d3xn.append('input').attr('id', 'input1').attr('value', 7)
    inputdiv_d3xn.append('div').text('number of notes').attr('class', 'inputdivs')
    inputdiv_d3xn.append('input').attr('id', 'input2').attr('value', 10)
    inputdiv_d3xn.append('div').attr('class', 'inputdivs')
    inputdiv_d3xn.append('button').text('make notes').on('click', start).attr('class', 'inputdivs')

    d3.selectAll('div.inputdivs').style('margin', '10px')
} //makeInputDoms

function makeBigDivs() {
    const notediv = d3.select('body').append('div')
        .attrs({ 'id': 'bigdiv', 'name': 'div for notes' })
        .styles({ 'width': '100%' })
    const bigdivr = notediv.append('div')
        .attrs({ 'id': 'bigdivr', 'name': 'Right hand div' })
        .styles({ 'border': 'solid 1px', 'width': '100%', 'height': '150px', 'margin-top': '20px', 'float': 'left' })
    const bigdivl = notediv.append('div')
        .attrs({ 'id': 'bigdivl', 'name': 'Left hand div' })
        .styles({ 'border': 'solid 1px', 'width': '100%', 'height': '150px', 'margin-top': '20px', 'float': 'left' })
} // makeBigDivs

function getNotesToDisplay(allnotes, startpos, length) {
    if (!startpos) { startpos = 1 }
    if (!length) (length = allnotes.length)

    let notes = allnotes.slice(startpos - 1, startpos - 1 + length)
    return notes
} //getNotesToDisplay