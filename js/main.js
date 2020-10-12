

let allnotes = datastr_to_stdobj(notesStr)

var lnotedivs = [], tmpdiv = undefined;
var rnotedivs = []

makeInputDoms()
makeBigDivs()






function start() {

    // get value from the input box
    let s = document.getElementById('input1')
    console.log(parseInt(s.value))
    let l = document.getElementById('input2')
    console.log(parseInt(l.value))

    let notes = getNotesToDisplay(allnotes, parseInt(s.value), parseInt(l.value))

    // remove notedivs
    let notedivs = document.getElementsByClassName('notediv')
    for (let i = 0; i < notedivs.length; i++) {
        // console.log(notedivs[i])
        notedivs[i].remove();
    }

    makenotedivs(notes)
    makeNotes(notes, parseInt(s.value), parseInt(l.value))

} //start

function makenotedivs(notes) {

    //delete the existing notedivs
    d3.selectAll('div.notediv').remove()

    let breakele = document.createElement('br')
    document.body.append(breakele)

    lnotedivs = [], rnotedivs = []

    let notelength = notes.length
    console.log(notelength)
    for (let z = 0; z <= notelength; z++) {
        let tmpdiv = document.createElement('div')
        tmpdiv.setAttribute('class', 'notediv')
        tmpdiv.setAttribute('id', 'notediv_' + z)
        bigdivl.appendChild(tmpdiv)
        lnotedivs.push(tmpdiv)

        tmpdiv = document.createElement('div')
        tmpdiv.setAttribute('class', 'notediv')
        tmpdiv.setAttribute('id', 'notediv_' + z)
        bigdivr.appendChild(tmpdiv)
        rnotedivs.push(tmpdiv)
    }

}// makenotedivs


async function makeNotes(notes, startpos, length) {

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


function createNote(finger, staffpos, hand, noteindex) {


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

    let overlaydivcontainer = adddiv(parent)
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


    function adddiv(parent) {
        let div = document.createElement('div')
        parent.appendChild(div)
        return div
    }

} // createnotes



