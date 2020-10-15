async function makeInputDoms() {

    let inputdiv_d3xn = d3.select('body').append('div').attr('id', 'inputdiv').attr('class', 'inputdivs')

    inputdiv_d3xn.append('div').text('start from').attr('class', 'inputdivs')
    inputdiv_d3xn.append('input').attr('id', 'input1').attr('value', 0)
    inputdiv_d3xn.append('div').text('number of notes').attr('class', 'inputdivs')
    inputdiv_d3xn.append('input').attr('id', 'input2').attr('value', 10000)
    inputdiv_d3xn.append('div').attr('class', 'inputdivs')
    inputdiv_d3xn.append('button').attr('id', 'makenote').text('make notes').on('click', async function () { await start(allnotes) }).attr('class', 'inputdivs')

    d3.selectAll('div.inputdivs').style('margin', '10px')

    $(document).on('keypress', ev => {
        // console.log(ev.key)
        if (ev.key === 'Enter') {
            d3.select('button#makenote').node().click()
        }
    })
} //makeInputDoms

async function makeBigDivs() {
    const bigdiv = d3.select('body').append('div')
        .attrs({ 'id': 'bigdiv', 'name': 'div for notes' })
        .styles({ 'width': '100%', 'height': '40%', 'margin-top': '5%' })
    const bigsvg = bigdiv.append('svg')
        .attrs({ "xmlns": "http://www.w3.org/2000/svg", "version": "1.1", 'id':'bigsvg' })
        .styles({ 'width': '100%', 'height': '400px', 'border': 'solid grey 1px', 'background-color': 'white' })
    
    const bigg = bigsvg.append('g').attr('id', 'bigg') // for zoom and pan of the piano icons


    //https://stackoverflow.com/questions/48790190/how-to-reset-zoom-in-d3-js
    // the trick is to let bigg (the g elment transform), but use the bigsvg to call the zoom.
    // Not the following, where to use bigsvg, where to use bigg!
    let zoom = d3.zoom().on('zoom', function (ev) { bigg.attr("transform", ev.transform) })
    bigsvg.call(zoom).on('dblclick.zoom', null) // disable double click as it'll mess up with node/circle dblclick


} // makeBigDivs

function getNotesToDisplay(allnotes, startpos, length) {
    if (!startpos) { startpos = 1 }
    if (!length) (length = allnotes.length)

    let notes = allnotes.slice(startpos - 1, startpos - 1 + length)
    return notes
} //getNotesToDisplay

async function start() {

    // get value from the input box
    let s = document.getElementById('input1')
    // console.log(parseInt(s.value))
    let l = document.getElementById('input2')
    // console.log(parseInt(l.value))

    // get slices of nodes to play
    notes = getNotesToDisplay(allnotes, parseInt(s.value), parseInt(l.value))


    // make note divs
    await makeNoteDivs(notes)

} //start




async function makeNotes(notes, startpos, length) {
    // loop for each note
    for (let i = 0; i < notes.length; i++) {
        let thenote = notes[i]
        // console.log(thenote)
        // get the left hand note
        let left = thenote.left
        if (left) {
            if (!left.finger) { left.finger = '' }
            createNote(left.finger, left.staffpos, 'l', i) //the createNote should be able to descriminate left/right type (a.for define tones (); b. for determine the upper or lower row)
        }
        // get the righ hand note
        let right = thenote.right
        if (right) {
            if (!right.finger) { right.finger = '' }
            createNote(right.finger, right.staffpos, 'r', i)
        } //if
    }// for
} //makeNotes


async function createNote(finger, staffpos, hand, noteindex) {


    let letternumber = staffpositionToLetterNumber(staffpos, letternumber_for_staffposition1[hand])
    // console.log(letternumber)

    let letter = NumToToneLetter(letternumber, anchor_A, n_tone_letters)
    // console.log(letter)

    let imgsrcforpiano;

    if (letter === 'C' || letter === 'D' || letter === 'E') {
        imgsrcforpiano = 'img/Pianokey1.PNG'
    } if (letter === 'F' || letter === 'G' || letter === 'A' || letter === 'B') {
        imgsrcforpiano = 'img/Pianokey2.PNG'
    }

    let parent;
    if (hand === 'l') {
        parent = lnotedivs[noteindex]
    } if (hand === 'r') {
        parent = rnotedivs[noteindex]
    }

    // console.log(' =======================', noteindex, parent)

    let overlaydivcontainer = await adddiv(parent)
    overlaydivcontainer.setAttribute('class', 'overlaycontain')

    let overlaydiv = document.createElement('div')
    overlaydivcontainer.appendChild(overlaydiv)
    overlaydiv.setAttribute('class', 'overlay')
    overlaydiv.style.display = 'block'

    overlaydiv.innerHTML = letter + '<br/>' + finger

    if (letter == 'C' || letter == 'F') {
        overlaydivcontainer.style.paddingLeft = '1px'
    } if (letter == 'E' || letter == 'A') {
        overlaydivcontainer.style.paddingLeft = '34px'
    } if (letter == 'B') {
        overlaydivcontainer.style.paddingLeft = '51px'
    }

    // let divinside = document.createElement('div')
    // overlaydiv.appendChild(divinside)
    // divinside.setAttribute('class', 'text')
    // divinside.innerText = letter

    var pianoimg = document.createElement('IMG')
    pianoimg.setAttribute('src', imgsrcforpiano);

    if (hand === 'l') {
        lnotedivs[noteindex].appendChild(pianoimg);
    }
    if (hand === 'r') {
        rnotedivs[noteindex].appendChild(pianoimg);
    }

    pianoimg.style.height = '100px'
    // pianoimg.style.position = 'absolute'

    // clickbutton.onclick = null


    async function adddiv(parent) {
        let div = document.createElement('div')
        parent.appendChild(div)
        return div
    }

} // createnotes
