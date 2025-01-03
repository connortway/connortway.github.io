

//global bool for toggle unused button
let isToggled = false;
//to check if the togge unused button is toggled when changing scale
let wasToggled = false;
//to check if is sharps or not
let isSharps = false;

let isSimple = false;
let red = 'rgb(239, 71, 111)';
let blue = 'rgb(38, 84, 124)';
let yellow = 'rgb(255, 209, 102)';
let green = "rgb(95, 173, 86)";
let grey = "rgb(187, 187, 187)";
let orange = "rgb(255, 68, 51)";

function clean(color) {
    // Get all elements with the class 'dot'
    const dots = document.querySelectorAll('.dot');
    
    // Loop through each dot and set the background color
    dots.forEach(dot => {
        dot.style.backgroundColor = color;
    });
}

function notes(note){
    clean(grey);
    let notes = note.value;
    let dots = document.querySelectorAll(`.${notes}`);
    dots.forEach(function(element){
        element.style.backgroundColor = red;
    })
}

function toggler() {
    let dots = document.querySelectorAll('.dot');
    let button = document.getElementById('toggler');


    dots.forEach(function(element) {
        // Get the computed style of the element for background color and opacity
        let computedStyle = window.getComputedStyle(element);
        let bgColor = computedStyle.backgroundColor;
        let currentOpacity = computedStyle.opacity;

        // Check if the background color is '#bbb' in RGB format
        if (bgColor === 'rgb(187, 187, 187)') {
            // Toggle opacity based on its current value
            if (currentOpacity === '0.8') { // Fully visible
                element.style.opacity = '0'; // Make it transparent
                isToggled = true
                button.innerHTML = "Show unused"
            } else {
                element.style.opacity = '0.8';
                button.innerHTML = "Hide unused"
                isToggled = false; // Make it fully visible

            }
        }
    });
}

//function to handle sharps or flats
function sharps(){
    const sharps = ['C#','D#', "F#", 'G#', 'A#'];
    const flats = ['Db','Eb', 'Gb', 'Ab', 'Bb'];

    let listScale = document.getElementById("listScale");
    let button = document.getElementById('sharps');

    if (isSharps === false){
        isSharps = true;
        button.innerHTML = "Flats"
        for(let i = 0; i < flats.length; i++){
           let note = document.querySelectorAll('.' + flats[i]);
           let newScale = listScale.textContent.replaceAll(flats[i], sharps[i]);
           listScale.innerHTML = newScale;
           
           note.forEach(function(element){
                element.innerHTML = sharps[i];
            });
        }
    

    }else {
        isSharps = false;
        button.innerHTML = "Sharps"
        for(let i = 0; i < flats.length; i++){

            let note = document.querySelectorAll('.' + flats[i]);

            
            let newScale = listScale.textContent.replaceAll(sharps[i], flats[i]);
            listScale.innerHTML = newScale;

            note.forEach(function(element){
                element.innerHTML = flats[i];
            })
         }
    }
}

function triads(note, scale){

    if(isToggled === true) {
        toggler();
        wasToggled = true;
    }

    clean('#bbb')

    let notes = generateScale(note.value, scale.value);

    let triad = [];
    
    triad.push(notes[0]);
    triad.push(notes[2]) 
    triad.push(notes[4]);

    console.log(triad);

    for (let i = 0; i < triad.length; i++) {
        let things = document.querySelectorAll('.' + triad[i]);
        //console.log('Selected elements for', notes[i], things);
        things.forEach(function(element) {
            if(i === 0){
                element.style.backgroundColor = red;
            }else if(i === 1){
                element.style.backgroundColor = blue;
            }else{
                element.style.backgroundColor = yellow;
            }
        });
    }

    let listScale = document.getElementById("listScale");

    listScale.innerHTML = triad;

    if(wasToggled === true){
        toggler();
    }

    
}


function Seventh(note, scale){
    if(isToggled === true) {
        toggler();
        wasToggled = true;
    }

    clean('#bbb')

    let notes = generateScale(note.value, scale.value);

    let seventh = [];

    seventh.push(notes[0]);
    seventh.push(notes[2]);
    seventh.push(notes[4]);
    seventh.push(notes[6]);

    for (let i = 0; i < seventh.length; i++) {
        let things = document.querySelectorAll('.' + seventh[i]);
        //console.log('Selected elements for', notes[i], things);
        things.forEach(function(element) {
            if(i === 0){
                element.style.backgroundColor = red;
            }else if(i === 1){
                element.style.backgroundColor = blue;
            }else if(i === 2){
                element.style.backgroundColor = yellow;
            }else{
                element.style.backgroundColor = green;
            }
        });
    }

    let listScale = document.getElementById("listScale");

    listScale.innerHTML = seventh;

    if(wasToggled === true){
        toggler();
    }
    
}


function newScale(){
    const ui = document.getElementById('ui');
    let temp = document.getElementById('ui2');
    ui2.innerHTML = ui.innerHTML;
    let removeButton = document.createElement("button");
    removeButton.textContent = "remove";
    removeButton.addEventListener("click", remove);
    ui2.appendChild(removeButton);
    const noteList = ui2.querySelector('#note');
    const scaleList = ui2.querySelector('#scale');
    noteList.setAttribute('id', 'note2');
    scaleList.setAttribute('id', 'scale2');
    const scaleButton = ui2.querySelector('#scaleButton');
    scaleButton.setAttribute('onclick', 'doubleScale(document.getElementById(\'note2\'), document.getElementById(\'scale2\'));')

}


function generateScale(startNote, scaleType) {
   //chromatic scale all possible notes in one octave
    const chromaticScale = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    

    // Scale patterns represented in semitone intervals from one note to the next
    const scalePatterns = {
        major: [2, 2, 1, 2, 2, 2, 1],     // Major scale
        dorian: [2, 1, 2, 2, 2, 1, 2],     // Dorian mode
        phrygian: [1, 2, 2, 2, 1, 2, 2],   // Phrygian mode
        lydian: [2, 2, 2, 1, 2, 2, 1],     // Lydian mode
        mixolydian: [2, 2, 1, 2, 2, 1, 2], // Mixolydian mode
        minor: [2, 1, 2, 2, 1, 2, 2],    // Natural minor scale
        locrian: [1, 2, 2, 1, 2, 2, 2],
        minorPentatonic: [3, 2, 2, 3, 2],
        majorPentatonic: [2, 2, 3, 2, 3],
        minorBlues: [3, 2 ,1 ,1 ,3 , 2],
        majorBlues: [2, 1, 1, 3, 2, 3],
        phrygianDominant: [1, 3, 1, 2, 1, 2, 2],
        harmonicMinor: [2, 1, 2, 2, 1, 3, 1],
        melodicMinor: [2, 1, 2, 2, 2, 2, 1],

    };

    // Get the pattern for the desired scale type
    const pattern = scalePatterns[scaleType];
    if (!pattern) {
        throw new Error(`Scale type '${scaleType}' is not recognized.`);
    }

    // Find the starting note's index in the chromatic scale
    const startIndex = chromaticScale.indexOf(startNote);
    if (startIndex === -1) {
        throw new Error(`Start note '${startNote}' is not recognized.`);
    }

    // Generate the scale
    let scale = [startNote];
    let currentIndex = startIndex;

    for (let interval of pattern) {
        currentIndex = (currentIndex + interval) % chromaticScale.length;
        scale.push(chromaticScale[currentIndex]);
    }

  

    return scale;
}


function scales(note, scale){
    
    // toggle all notes to be showing before recoloring according to scale
    if(isToggled !== false){
        toggler();
        wasToggled = true;
    }
    clean('#bbb');
    
    
    let notes = generateScale(note.value, scale.value);

    let listScale = document.getElementById("listScale");
    
    let updatedNotes = notes.slice(0, -1);
    listScale.innerHTML = updatedNotes;
    
   

    //assigns scale to notes 
    for (let i = 0; i < notes.length; i++) {
        let things = document.querySelectorAll('.' + notes[i]);
        //console.log('Selected elements for', notes[i], things);
        things.forEach(function(element) {
            if(notes[i] === note.value){
            element.style.backgroundColor = red;
            }else if(i === 2){
                element.style.backgroundColor = blue;
            }else if(i === 4){
                element.style.backgroundColor = yellow;
            }else if(i === 6){
                element.style.backgroundColor = orange;
            }else{
                element.style.backgroundColor = green;
            }
        });
    }

    //retoggles toggle button if it was toggled before
    if(wasToggled === true){
        toggler();
    }
    console.log(isSharps); 

}

function doubleScale(note, scale){
       // toggle all notes to be showing before recoloring according to scale
       simpleColors();
       if(isToggled !== false){
        toggler();
        wasToggled = true;
    }
    //clean('#bbb');
    
    
    let notes = generateScale(note.value, scale.value);

    let listScale = document.getElementById("listScale");
    
    let updatedNotes = notes.slice(0, -1);
    listScale.innerHTML = updatedNotes;
    
   

    //assigns scale to notes 
    for (let i = 0; i < notes.length; i++) {
        let things = document.querySelectorAll('.' + notes[i]);
        //console.log('Selected elements for', notes[i], things);
        things.forEach(function(element) {
            if(notes[i] === note.value){
            element.style.backgroundColor = red;
            }else if(element.style.backgroundColor !== grey || element.style.backgroundColor !== red){
                element.style.backgroundColor = 'purple';
            }else {
                element.style.backgroundColor = green;
            }
        });
    }

    //retoggles toggle button if it was toggled before
    if(wasToggled === true){
        toggler();
    }
    console.log(isSharps); 

}

function remove(){
    let note = document.getElementById("note");
    let scale = document.getElementById("scale");
    if(note.value !== "null" && scale.value !== "null"){
        scales(note, scale);
        console.log("poo");
    }

    let ui = document.getElementById("ui2");
    ui.remove();
}


function simpleColors(){
    const dots = document.querySelectorAll('.dot');
    if(isSimple === false){
        isSimple = true;
        dots.forEach(dot => {
                // iterate through each dot and set the background color
            if (dot.style.backgroundColor === blue || dot.style.backgroundColor === yellow){
                dot.style.backgroundColor = green;
            }
        });
    }else{
        scales(document.getElementById('note'), document.getElementById('scale'));
        isSimple = false;
    }

    
    

}
















// function getScale(scale){
//     const scales = new Map([
//         ["Aminor", ["A", "C", "D", "E", "G"]],
//         ["Cminor", ["C", "Eb", "F", "G", "Bb"]],
//         ["Amajor", ["A", "B", "Db", "D", "E", "Gb", "Ab"]],
//         ["Chromatic", ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"]]
//     ]);
//     return scales.get(scale);
// }





// functon to create any pattern on the fretboard (maybe use later for chords or to isolate certain sections of fretboard)
//unused right now
// function decode(scale){
//     clean('#bbb');
//     const matrices = {
//         Aminor: [
//             [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
//             [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
//             [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]
//         ],
//         Cminor: [
//             [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
//             [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
//             [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0]
//         ],
//         matrixC: [
//             [5, 4, 3],
//             [2, 1, 0],
//             [9, 8, 7]
//         ]
//     }
//     const pee = scale.value;
//     const matrix = matrices[pee];
//     console.log(matrix);
//     console.log(pee);

//     for (let i = 0; i < matrix.length; i++) {
//         for (let j = 0; j < matrix[i].length; j++) {
//             if(matrix[i][j] === 1){
//                 let elementId = `${i},${j}`;
//                 let dot = document.getElementById(elementId);
//                 dot.style.backgroundColor="blue";
//             } 

//             if(matrix[i][j] === 2){
//                 let elementId = `${i},${j}`;
//                 let dot = document.getElementById(elementId);
//                 dot.style.backgroundColor="red";
//             }
//             // console.log(`Element at [${i}][${j}]: ${matrix[i][j]}`);
//         }
//     }
// }