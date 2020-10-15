// build a piano



async function buildPianoWrappers() {
    let pianodiv_d3xn = d3.select('div#bigdiv').append('div')
        .attrs({ 'id': 'pianodiv', 'name': 'pianodiv' })
        .styles({ 'border': 'solid 0px', 'width': '100%', 
                'height': pianokeysize.fullscreen_whitekey.height, 'margin-top': '100px', 'float': 'left'})

    let pianosvg_d3xn = pianodiv_d3xn.append('svg').attrs({ 'id': 'pianosvg' })
        .styles({ 'height': '100%', 'width': '100%', 'background-color': 'white' })
    let pianog_d3xn = pianosvg_d3xn.append('g').attrs({ 'id': 'pianog' })
} //


async function buildPianoKeys() {
    let pianog_d3xn = d3.select('g#pianog')
    // get the clientsize of the pianosvg
    let pianosvg_d3xn = d3.select('svg#pianosvg')
    let pianosvgsize = pianosvg_d3xn.node().getBoundingClientRect()
    // the pianosvg should contain 7 sets +3 of white keys (A to G), thus totally 49+3 = 52
    // so, the width of the svg should be split into 52 equal parts, each as a chamber for a white key
    let width_keychamber = pianosvgsize.width / 52
    // the width of a white key is the width of a key chamber minus the stroke-width of the 2 key borders
    let width_whitekey = width_keychamber // / (2* pianokeydata.stdattrs['stroke-width'])
    // a standard white key 's width is 23.5 mm, length 14mm, while a blackkey's width 13.7mm, length 10 mm
    // as such, the length of a white piano key is 23.5/14 of the width, of a black key 13.7/10 of the width
    // these have been put in the config.js 
    let height_whitekey = width_whitekey * (pianokeysize.white.length / pianokeysize.white.width)
    // but if the calculated height is too high, go back and adjust the width
    if (height_whitekey > pianosvgsize.height) {
        height_whitekey = pianosvgsize.height
        width_whitekey = height_whitekey / (pianokeysize.white.length / pianokeysize.white.width)
        width_keychamber = width_whitekey
    }


    // https://en.wikipedia.org/wiki/Musical_keyboard#:~:text=Modern%20piano%20keyboards%20ordinarily%20have,base%2C%20disregarding%20space%20between%20keys.
    // stdattrs:{'class':'keyrect', 'stroke':'black','stroke-width':1}
    // this is to have 52 white keys
    let wkeys = []
    for (let i = 0; i < 52; i++) {
        wkeys.push(i)
    }

    pianog_d3xn.selectAll('g.whitekeyg')
        .data(wkeys)
        .enter()
        .append('g')
        .attrs({ 'class': 'whitekeyg' })
        .attr('id', (d, i) => {
            // to determin the tone letter of each key
            let letternumber = i
            let anchor_A = 65
            let rng = 7
            let toneletter = NumToToneLetter(letternumber, anchor_A, rng)
            // calculate the number of octaves
            // starting from the key[2], the octave number increases by 1 for every 7 keys, what is the math of it?
            let octaveN = 0
            if (i > 1) {
                octaveN = parseInt((i - 2) / 7) + 1
            }
            return 'keyg_' + toneletter + octaveN
        })
        .append('rect')
        .attrs(pianokeydata.stdrectattrs)
        .attrs({ 'fill': 'white' })
        .styles({ 'width': width_whitekey + 'px', 'height': height_whitekey + 'px' })
        .attr('id', (d, i) => {
            // to determin the tone letter of each key
            let letternumber = i
            let anchor_A = 65
            let rng = 7
            let toneletter = NumToToneLetter(letternumber, anchor_A, rng)
            // calculate the number of octaves
            // starting from the key[2], the octave number increases by 1 for every 7 keys, what is the math of it?
            let octaveN = 0
            if (i > 1) {
                octaveN = parseInt((i - 2) / 7) + 1
            }
            return 'key_' + toneletter + octaveN
        })
        // .on('click', async function (ev) {
        //     // console.log(ev)
        //     await onKeyPress(ev)
        // }) has conflict with mouse down event, do not set click event here
        .on('mousedown', async function (ev) {
            // console.log('mousedown')
    
            ev.preventDefault()
            ev.stopPropagation()
    
            playPressedKey(ev)
            // console.log(d3.select(ev.target));
    
        }) 

    pianog_d3xn.selectAll('g.whitekeyg')
        .append('text')
        .attrs(pianokeydata.stdtextattrs.white)
        .attr('transform', d => {
            let y = height_whitekey * 7 / 8
            let translateStr = 'translate(' + width_whitekey / 4 + ',' + y + ')'
            return translateStr
        })
        .attr('font-size', d => {
            return pianokeydata.stdtextattrs.white['font-size'] * width_whitekey / pianokeysize.fullscreen_whitekey.width
        })

        .text((d, i) => {
            // to determin the tone letter of each key
            let letternumber = i
            let anchor_A = 65
            let rng = 7
            let toneletter = NumToToneLetter(letternumber, anchor_A, rng)
            // calculate the number of octaves
            // starting from the key[2], the octave number increases by 1 for every 7 keys, what is the math of it?
            let octaveN = 0
            if (i > 1) {
                octaveN = parseInt((i - 2) / 7) + 1
            }
            return toneletter + octaveN
        })

    //NumToToneLetter(letternumber, anchor_A, rng) 

    d3.selectAll('g.whitekeyg')
        .attr('transform', (d, i) => {
            // console.log(width_whitekey, i, width_whitekey*i)
            let x = width_keychamber * i
            let translateStr = 'translate(' + x + ',0)'
            // console.log(translateStr)
            return translateStr
        })

    // add black keys between white keys, except that the current white key is B or E
    d3.selectAll('g.whitekeyg').nodes().forEach((em, emi) => {
        let keygidstr = em.id
        // get the key letter embedded in the id (the id is lke keyg_A0)
        let toneletter = keygidstr.substr(5, 1)
        if (!(['B', 'E'].includes(toneletter) || keygidstr === 'keyg_C8')) {
            addBlackKey_wholepiano(em, emi, width_whitekey, height_whitekey)
        }
    }) // forEach white key em (rect)



} //buildPianoKeys



// build a piano key (a rect) 
function addBlackKey_wholepiano(em, emi, width_whitekey, height_whitekey) {
    // console.log(height_whitekey)
    // console.log(pianokeysize.black.length)
    // console.log(pianokeysize.fullscreen_whitekey.height)

    // using the height_whitekey to determine the size of the black key
    let height_blackkey = pianokeysize.black.length * (height_whitekey / pianokeysize.fullscreen_whitekey.height)
    // console.log(height_blackkey)
    let width_blackkey = pianokeysize.black.width * (height_blackkey / pianokeysize.black.length)

    let keygidstr = em.id
    // get the key letter embedded in the id (the id is lke keyg_A0)
    let toneletter = keygidstr.substr(5, 1)
    let octaveN = keygidstr.substr(6, 1)

    let keyg = d3.select('g#pianog')
        .append('g')
        .attrs({ 'class': 'blackkeyg' })
        .attr('id', (d, i) => {
            return 'keyg_' + toneletter + 's' + octaveN
        })

        .attr('transform', d => {
            let x = emi * width_whitekey + width_whitekey / 2 + width_blackkey / 2
            let y = 0
            let translateStr =
                'translate (' + x + ',' + y + ')'
            return translateStr
        })

    keyg
        .append('rect')
        .attrs(pianokeydata.stdrectattrs)
        .attrs({ 'fill': 'black' })
        .styles({ 'width': width_blackkey + 'px', 'height': height_blackkey + 'px' })
        .attr('id', (d, i) => {
            return 'key_' + toneletter + 's' + octaveN
        })
        // .on('click', async function (ev) {
        //     // console.log(ev)
        //     await onKeyPress(ev)
        // }) // conflic with mouse down setting, do not set click event here
        .on('mousedown', async function (ev) {
            // console.log('mousedown')
    
            ev.preventDefault()
            ev.stopPropagation()
    
            playPressedKey(ev)
            // console.log(d3.select(ev.target));    
        })

    keyg
        .append('text')
        .attrs(pianokeydata.stdtextattrs.black)
        .attr('color', 'white')
        .attr('transform', d => {
            let y = height_blackkey * 5 / 8
            let translateStr = 'translate(' + width_blackkey / 4 + ',' + y + ') rotate(90) '
            return translateStr
        })
        .attr('font-size', d => {
            return pianokeydata.stdtextattrs.black['font-size'] * height_whitekey / pianokeysize.fullscreen_whitekey.height
        })
        .text((d, i) => {
            return '#' + toneletter  + octaveN
        })
} //