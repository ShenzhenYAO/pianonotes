const body = document.body

let str =`
l5,3
l6
l5
l5
l6
l5
r1,1
r3.5,4l5,3
l6,1
l5,3
r2.5,2
r4,5l4,2+
r3.5,4
r3,3
r3.5,4l3.5,3
r2.5,3+
r3.5,5l3.5,3
r3,4
r2.5,3l3,4
r3,4
l4,2
r2,2l3.5,3
r1,1l2.5,5
`
function str2notes (str){
    // split by line breaker
    let note_arr = str.split(/\n/)
    // console.log(note_arr)

    let notes = []
    note_arr.forEach(d=>{
        if (d) {
            let L = d.split('l')[1]
            if (L=== undefined){ L=''}
            let R = d.split('l')[0]
            R = R.replace('r', '')
            
            let Lnote, Lfinger, Rnote, Rfinger;
            if (L.includes(',')){
                 Lnote = L.split(',')[0]
                 Lfinger = L.split(',')[1]
                if (!Lfinger) {Lfinger=''}
            } else {
                 Lnote=L
                 Lfinger=''
            }

            if (R.includes(',')){
                Rnote = R.split(',')[0]
                Rfinger = R.split(',')[1]
               if (!Rfinger) {Rfinger=''}
           } else {
                Rnote=R
                Rfinger=''
           }
           let tmp = {R:{}, L:{}}
           tmp.R.line = Rnote, tmp.L.line=Lnote, tmp.R.finger = Rfinger, tmp.L.finger = Lfinger
            // console.log(Lnote, Lfinger,  '------', Rnote, Rfinger)
           notes.push(tmp)
        } // if d

    }) // forEach
    // console.log(notes)
    return notes
}

let allnotes = str2notes(str)
function getnotes(allnotes, startpos, length){
    if (!startpos) {startpos =1}
    if (!length) (length=allnotes.length)

    let notes = allnotes.slice(startpos-1, startpos-1 + length)
    return notes
}



// console.log(notes)


//add two input box
let div0 =document.createElement('div')
document.body.append(div0)
div0.innerText = 'start from'
let input1 =document.createElement('input')
document.body.append(input1)
input1.setAttribute('id', 'input1')
input1.value=1
let div1 =document.createElement('div')
document.body.append(div1)
div1.innerText = 'length'
let input2 =document.createElement('input')
document.body.append(input2)
input2.value=allnotes.length
input2.setAttribute('id', 'input2')
let div2 = document.createElement('div')
document.body.append(div2)
div2.style.height = '20px '
let clickbutton = document.createElement('button')
document.body.append(clickbutton)
clickbutton.innerText = 'make notes'
clickbutton.onclick = start

let div3 = document.createElement('div')
document.body.append(div3)
div3.style.height = '20px '


const bigdivr = document.createElement('div')
body.appendChild(bigdivr)
bigdivr.setAttribute('id', 'bigdivr')
bigdivr.setAttribute('name', 'Right hand div')
bigdivr.style.border="solid 1px"
bigdivr.style.height = '150px'
const bigdivl = document.createElement('div')
body.appendChild(bigdivl)
bigdivl.setAttribute('name', 'Left hand div')
bigdivl.setAttribute('id', 'bigdivl')
bigdivl.style.border="solid 1px"
bigdivl.style.height = '150px'


function start(){
    let s = document.getElementById('input1')
    console.log(parseInt(s.value))
    let l = document.getElementById('input2')
    console.log(parseInt(l.value))
    let notes = getnotes(allnotes, parseInt(s.value),parseInt(l.value))

    // remove notedivs
    let notedivs = document.getElementsByClassName('notediv')
    for (let i = 0; i < notedivs.length; i++) {
        // console.log(notedivs[i])
        notedivs[i].remove();
      }

    makenotedivs(notes)

    makeNotes(notes, parseInt(s.value),parseInt(l.value))
}

var lnotedivs = [], tmpdiv = undefined;
var rnotedivs = []




function makenotedivs(notes){

    let breakele = document.createElement('br')
    document.body.append(breakele)
    

    // createNote(1, 2)
    // createNote(1, 2.5)
    // createNote(1, 1)
    // createNote(1, 0)

    lnotedivs=[], rnotedivs=[]
    
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
        let left = thenote.L
        if(left.line === ""){left = null}
        if (left) {
            if (!left.finger) { left.finger = '' }
            createNote(left.finger, left.line, 'l', i) //the createNote should be able to descriminate left/right type (a.for define tones (); b. for determine the upper or lower row)
        }
        // get the righ hand note
        let right = thenote.R        
        if(right.line === ""){right = null}
        if (right) {
            if (!right.finger) { right.finger = '' }
            createNote(right.finger, right.line, 'r', i)
        } //if
    }// for
} //makeNotes

function createNote(finger, ln, h, noteindex) {

    let n = 65;
    let anchor_A = 65;
    let rng = 7;
    let theletter = getletter(n, anchor_A, rng)
    // console.log(theletter)
    function getletter(n, anchor_A, rng) {

        let remainder = n % anchor_A;
        let remainder2 = remainder % rng;

        let letter = String.fromCharCode(65 + remainder2)
        return letter
    } // 

    let hand

    if (h === 'l') {
        hand = 71
    } if (h === 'r') {
        hand = 69
    }

    // 1 => 69
    // 1.5 =>70 
    let linenumber = ln
    let anchor = 1
    let anchor2 = hand //this is the base note for right hand, line 1 is E.
    function getthenum(linenumber, anchor, anchor2) {

        let dist = (linenumber - anchor) * 2
        // console.log(dist)
        let thenum = dist + anchor2
        return thenum
    }
    let distcalc = getthenum(linenumber, anchor, anchor2)
    // console.log(distcalc)
    n = distcalc;
    let final = getletter(n, anchor_A, rng)
    // console.log(final)

    let imgsrcforpiano;

    if (final === 'C' || final === 'D' || final === 'E') {
        imgsrcforpiano = 'Pianokey1.PNG'
    } if (final === 'F' || final === 'G' || final === 'A' || final === 'B') {
        imgsrcforpiano = 'Pianokey2.PNG'
    }

    let parent;
    if (h === 'l') {
        parent = lnotedivs[noteindex]
    } if (h === 'r') {
        parent = rnotedivs[noteindex]
    }

    // console.log(' =======================', noteindex, parent)

    let overlaydivcontainer = adddiv(parent)
    overlaydivcontainer.setAttribute('class', 'overlaycontain')

    let overlaydiv = document.createElement('div')
    overlaydivcontainer.appendChild(overlaydiv)
    overlaydiv.setAttribute('class', 'overlay')
    overlaydiv.style.display = 'block'

    overlaydiv.innerHTML = final + '<br/>' + finger

    if (final == 'C' || final == 'F') {
        overlaydivcontainer.style.paddingLeft = '1px'
    } if (final == 'E' || final == 'A') {
        overlaydivcontainer.style.paddingLeft = '34px'
    } if (final == 'B') {
        overlaydivcontainer.style.paddingLeft = '51px'
    }

    // let divinside = document.createElement('div')
    // overlaydiv.appendChild(divinside)
    // divinside.setAttribute('class', 'text')
    // divinside.innerText = final

    var pianoimg = document.createElement('IMG')
    pianoimg.setAttribute('src', imgsrcforpiano);

    if (h==='l'){
        lnotedivs[noteindex].appendChild(pianoimg);
    }
    if (h==='r') {
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

}




// const notes = [
//         { L: { i: 3, line: 5 } }
//         , { L: { i:'' , line: 6 } }
//         , { L: { i: '', line: 5 } }
//         , { L: { i: '', line: 5 } }
//         , { L: { i: '', line: 6 } }
//         , { L: { i: '', line: 5 } }

//     , { R: { i: 1, line: 1 } }
//     , { R: { i: 4, line: 3.5 } , L: { i: '', line: 5 }, }
//         , { L: { i: '', line: 6 } }
//         , { L: { i: '', line: 5 } }
//     , { R: { i: '2', line: 2.5 } }

//     , { R: { i: '5', line:4 }, L: { i: '2+', line: 4}, }
//     , { R: { i: '4', line:3.5 },   }
//     , { R: { i: '3', line:3 },  }

//     , { R: { i: '4', line:3.5 }, L: { i: '3', line: 3.5}, }
//     , { R: { i: '3+', line:2.5 },  }
//     , { R: { i: '4', line:3 },  }
//         , { L: { i: '2', line: 4}, }

//     , { R: { i: '2', line:2 }, L: { i: '3', line: 3.5}, }
//     , { R: { i: '1', line:1 }, L: { i: '5', line: 2.5}, }
// ]

