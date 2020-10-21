/**translate a data string into a standardized data object like {staffpos:, finger:} */



function datastr_to_stdobj(str) {

    let result =[]
    // split into strings for each moment    
    let momentStrs = getMomentStrs(str);
    // loop for string of eacn moment
    momentStrs.forEach(momentStr => {
        // console.log(momentStr)
        // split into left/right clef
        let clefs = getclef(momentStr.data);
        let cleftkeys = Object.keys(clefs)
        cleftkeys.forEach(f => {
            // split by ';' to have data
            let _arr = clefs[f].split(";")
            // for each note in _arr, get data of staff postion, beat, and finger
            _arr.forEach((g, i) => {
                let notedata_obj = getNodeData(g)
                notedata_obj.dataline = momentStr.line
                _arr[i] = notedata_obj
            })
            clefs[f] = _arr
        }) // for each cleftkey
        if (clefs) { result.push(clefs) }
    }) // for each momentstr

    // console.log(result)
    return result

}//  datastr_to_stdobj



// input: string split by ','; output: obj of staffpos, beat and finger
function getNodeData(d) {
    let tmp = {}
    let e = d.split(',')
    if (e[0] !== null && e[0] !== undefined && e[0].trim().length > 0) {

        if (e[0].trim().substr(e[0].trim().length-1,1) === 's'){
            tmp.semi = '#'
        } 
        if (e[0].trim().substr(e[0].trim().length-1,1) === 'f'){
            tmp.semi = 'b'
        }
        tmp.staffpos = parseFloat(e[0])
    }
    if (e[1] !== null && e[1] !== undefined && e[1].trim().length > 0) {
        tmp.beat = parseFloat(e[1])
    }
    if (e[2] !== null && e[2] !== undefined && e[2].trim().length > 0) {
        tmp.finger = e[2]
    }
    // console.log(tmp)
    return (tmp)
} // getNodeData


// input: a segment of string representing notes to be placed at the same moment; output: the left/right clef string
function getclef(d) {

    //0. the letter 'r' is useless, just to make it easy to understand when inputting the node strings
    d = d.replace('r', '') // remove the letter 'r'

    // 1. split R and L, data for right/left hand
    let left = null, right = null;

    let _arr = d.split('l')

    // if there is only one element, it is all for right hand
    if (_arr.length === 1) {
        right = _arr[0].trim()
    } else {
        right = _arr[0].trim()
        left = _arr[1].trim()
    } // 
    let tmp = {}
    if (left !== null && left.length > 0) { tmp.left = left }
    if (right !== null && right.length > 0) { tmp.right = right }

    return tmp
} //getclefs

// input: text of notes; output: a collection of note strings of the same moment
function getMomentStrs(str) {
    let result = []
    //1. split by line breaker into note segments, each segments containing notes to be played at the same moment
    let _arr = str.split(/\n/)
    // console.log(_arr)
    if (_arr) {
        
        _arr.forEach((d, i) => {
            if (d !== null && d.trim().length > 0){
                let tmp={}
                tmp.line = i+1
            tmp.data=d
                result.push(tmp)
            }            
        })
    }
    return result
} // getMomentStrs
