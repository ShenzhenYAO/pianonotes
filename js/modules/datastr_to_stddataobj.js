/**translate a data string into a standardized data object like {staffpos:, finger:} */
function datastr_to_stdobj(str) {


    // split by line breaker
    let note_arr = str.split(/\n/)
    // console.log(note_arr)

    let notes = []
    note_arr.forEach((d, i) => {
        if (d ) {
            // 1. split R and L, data for right/left hand
            let L = null, R= null;
            // if the string segment contains letter 'l', it has data for both left and right hands
            if (d.includes('l')) { 
                // split by 'l', the second part is the data for left hand
                 L = d.split('l')[1]
                // the part before 'l' is data for righ hand
                 R = d.split('l')[0]
                R = R.replace('r', '') // remove the letter 'r'
            } else {
                // the whole segment is for right hand
                 R = d
                R = R.replace('r', '') // remove the letter 'r'
            }

            // 2. for R or L, split data for staff position, and for finger
            function splitPosFinger(str) {
                let staffpos, finger;
                if (str.includes(',')) {
                    staffpos = parseFloat(str.split(',')[0])
                    finger = str.split(',')[1]
                    return {staffpos: staffpos, finger: finger}
                } else {
                    staffpos = parseFloat(str)
                    return {staffpos: staffpos}
                } // if
            } // splitPosFinger
            let tmp ={}, L_obj, R_obj
            if(L) { L_obj = splitPosFinger(L)}
            if(R) { R_obj = splitPosFinger(R)}
            if(L_obj){tmp.left = L_obj}
            if(R_obj){tmp.right = R_obj}
            notes.push(tmp)
        } // if d
    }) // forEach
    // console.log(notes)
    return notes
}