"use strict";

//https://developer.mozilla.org/en-US/docs/Web/API/FileReader
// read contents of a local file
async function readlocalfile(thefileobj, callback_whendoneDosomething) { // the fileobj is a file system object, containing file name, size, path, etc.
    var newreaderinstance = new FileReader(); // create a new instance of FileReader() class
    newreaderinstance.readAsText(thefileobj); // use the method readAsText of the new instance to read the file
    newreaderinstance.onload = callback_whendoneDosomething; // when the loading is done, run the call back function defined in the readfile instance
}

// make a dom element (by jquery)async function MakeDomEle(data) {
async function MakeDomEle(data) {

    let theNewEle = document.createElement(data.nodetype)
    data.parent.append(theNewEle)
    // add attributes (id, class, whatever)
    if (data.attrs) {
        $(theNewEle).attr(data.attrs)
    }
    if (data.styles) {
        $(theNewEle).css(data.styles)
    }
    if (data.events) {
        // get the number of keys
        for (let i = 0; i < Object.keys(data.events).length; i++) {
            let thekey = Object.keys(data.events)[i]
            let theaction = data.events[thekey]
            $(theNewEle).on(thekey, theaction)
        }
    }
    if (data.children) {
        data.children.forEach(d => {
            // console.log(theNewEle)
            d.parent = theNewEle
            MakeDomEle(d)
        })
    }
    if (data.properties) {
        $(theNewEle).prop(data.properties)
    }
    return theNewEle
}


//make a modal tempalte
// more details can be found at: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_signup_form_modal
async function MakeModalTemplate(modaltemplatedata, notclose) {

    await MakeDomEle(modaltemplatedata)

    // draggable: only enabled when the title box is mouse down
    // this is to prevent jquery ui hijacking the whole modal and making it not editable
    // which could happen when editing description of a node
    // https://api.jquery.com/focusin/
    $('div#modal-title').on('mousedown', function () {
            $('div#modal-dialogbox').draggable({ disabled: false })
        })
    $('div#modal-title').on('mouseup', function () {
            $('div#modal-dialogbox').draggable({ disabled: true })
        })

    // add a listener, when the enter key is pressed and is keyup, click the submit button. 
    // when the esc key is pressed and is keyup, click the close modal button
    $(document).on('keyup', function (event) {
        event.preventDefault();
        if (event.key === 'Enter') {     //enter        
            // Trigger the button element with a click
            if (document.getElementById("modalsubmitbutton")  ) {
                document.getElementById("modalsubmitbutton").click();                
            } else if (document.getElementsByClassName("submit")){
                document.getElementsByClassName("submit")[0].click();
            }
        } else if (event.key === 'Escape') { //esc
            if (document.getElementById("modal-close-button")) {
                document.getElementById("modal-close-button").click();
            }
        }        
    });

    if (! notclose) {
        $('#modal-close-button').on('click', closemodal) // not closemodal(), but closemodal, why?
    }
    
} //

async function closemodal() {
    $('#modal-background').remove()
}

// remove all children nodes from an element
async function removenodes(parent) {
    // cleanup children
    removeAllChildNodes(parent)
    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
} // removenodes



// randomly generate a non-repeating id
//https://bl.ocks.org/adamfeuer/042bfa0dde0059e2b288
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

//confirm to delete
function confirmDelete() {
    let del = confirm("Confirm to delete!");
    return del;
}



// get mouse and key
function getmousekey(ev) {
    let mousekey = '';
    switch (ev.sourceEvent.button) {
        case 0: mousekey = 'primary(left) click'; break;
        case 1: mousekey = 'secondary(right) click'; break;
    };

    let ctrlkey = '', altkey = '', shiftkey = '';
    if (ev.sourceEvent.ctrlKey === true) { ctrlkey = 'ctrl ' }
    if (ev.sourceEvent.altKey === true) { altkey = 'alt ' }
    if (ev.sourceEvent.shiftKey === true) { shiftkey = 'shift ' }
    let presskeys = ctrlkey + altkey + shiftkey;

    let combinedkeys = presskeys + mousekey
    // console.log(combinedkeys)
    return combinedkeys
}

function getDistinctValue(srcArray) {
    //https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
    function onlyUnique(value, index, self) { return self.indexOf(value) === index; }
    return srcArray.filter(onlyUnique)
} //getDistinctValue



async function clipboardcopy(text) {
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard

    //1. create a secrete textarea, and save the text there
    let ta_dom = document.createElement('textarea')
    document.body.append(ta_dom)
    ta_dom.setAttribute('id', 'copyta')
    ta_dom.innerText = text
    // console.log(ta_dom)

    //2. copy the text of the ta_dom to clipboard
    //2a. select the text area
    ta_dom.select()
    //2b. copy
    document.execCommand("copy")
    // // use promise to read the copied contents from clipboard
    // navigator.clipboard.readText().then(d => {
    //     console.log(d)
    // }) // navigator...

    //3. remove the textarea
    ta_dom.remove()
    // console.log(ta_dom)
} // clipboardcopy

// get contents from the clipboard
async function clipboardpaste(text) {
    var newpromise = new Promise(
        // then new promise is to define a resolved value
        (resolve) => {
            navigator.clipboard.readText().then(d => {
                resolve(d)
            }) // navigator...
        }//resolve
    ) // new promise;
    var resolved = await newpromise.then(d => {
        return d
    })
    return resolved
}//clipboardpaste

