// Global states
let isToggled = false;
let wasToggled = false;
let isSharps = false;
let isSimple = false;

// Scale Colors
let red = 'rgb(239, 71, 111)';
let blue = 'rgb(38, 84, 124)';
let yellow = 'rgb(255, 209, 102)';
let green = 'rgb(95, 173, 86)';
let orange = 'rgb(255, 68, 51)';

// Dynamic Grey for unused dots (starts Dark Mode)
let grey = 'rgb(51, 51, 51)'; 

// ----- NEW: Theme Toggle Function -----
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('themeToggle');
    let oldGrey = grey;

    // Toggle CSS class
    body.classList.toggle('light-mode');

    // Update the JS variables based on the active theme
    if (body.classList.contains('light-mode')) {
        grey = 'rgb(187, 187, 187)'; // Light mode empty dot
        themeBtn.innerHTML = "🌙 Dark Mode";
    } else {
        grey = 'rgb(51, 51, 51)';    // Dark mode empty dot
        themeBtn.innerHTML = "☀️ Light Mode";
    }

    // Live update any dots that are currently "empty" to match the new theme
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        if (dot.style.backgroundColor === oldGrey || dot.style.backgroundColor === "") {
            dot.style.backgroundColor = grey;
        }
    });
}

function clean(color) {
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.style.backgroundColor = color;
        dot.style.opacity = '1'; // Reset opacity when clearing
    });
}

function notes(note){
    clean(grey);
    let notes = note.value;
    let dots = document.querySelectorAll(`.${notes}`);
    dots.forEach(function(element){
        element.style.backgroundColor = red;
    });
}

function toggler() {
    let dots = document.querySelectorAll('.dot');
    let button = document.getElementById('toggler');

    dots.forEach(function(element) {
        let bgColor = element.style.backgroundColor;
        
        // If empty or matches current theme's empty color
        if (bgColor === grey || bgColor === '') {
            let currentOpacity = element.style.opacity;
            if (currentOpacity === '1' || currentOpacity === '') { 
                element.style.opacity = '0'; 
            } else {
                element.style.opacity = '1'; 
            }
        }
    });

    if(isToggled){
        isToggled = false;
        button.innerHTML = "Hide unused";
    } else {
        isToggled = true;
        button.innerHTML = "Show unused";
    }
}

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
    } else {
        isSharps = false;
        button.innerHTML = "Sharps"
        for(let i = 0; i < flats.length; i++){
            let note = document.querySelectorAll('.' + flats[i]);
            let newScale = listScale.textContent.replaceAll(sharps[i], flats[i]);
            listScale.innerHTML = newScale;

            note.forEach(function(element){
                element.innerHTML = flats[i];
            });
         }
    }
}

function triads(note, scale){
    if(isToggled === true) {
        toggler();
        wasToggled = true;
    }
    clean(grey);

    let notes = generateScale(note.value, scale.value);
    let triad = [];
    
    triad.push(notes[0]);
    triad.push(notes[2]);
    triad.push(notes[4]);

    for (let i = 0; i < triad.length; i++) {
        let things = document.querySelectorAll('.' + triad[i]);
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
    // .join separates the array elements with empty spaces instead of commas
    listScale.innerHTML = triad.join(' &nbsp;&nbsp;&nbsp; ');

    if(wasToggled === true){
        toggler();
    }
}

function Seventh(note, scale){
    if(isToggled === true) {
        toggler();
        wasToggled = true;
    }
    clean(grey);

    let notes = generateScale(note.value, scale.value);
    let seventh = [];

    seventh.push(notes[0]);
    seventh.push(notes[2]);
    seventh.push(notes[4]);
    seventh.push(notes[6]);

    for (let i = 0; i < seventh.length; i++) {
        let things = document.querySelectorAll('.' + seventh[i]);
        things.forEach(function(element) {
            if(i === 0){
                element.style.backgroundColor = red;
            }else if(i === 1){
                element.style.backgroundColor = blue;
            }else if(i === 2){
                element.style.backgroundColor = yellow;
            }else{
                element.style.backgroundColor = orange;
            }
        });
    }

    let listScale = document.getElementById("listScale");
    listScale.innerHTML = seventh.join(' &nbsp;&nbsp;&nbsp; ');

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
    const chromaticScale = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    
    const scalePatterns = {
        major: [2, 2, 1, 2, 2, 2, 1],     
        dorian: [2, 1, 2, 2, 2, 1, 2],     
        phrygian: [1, 2, 2, 2, 1, 2, 2],   
        lydian: [2, 2, 2, 1, 2, 2, 1],     
        mixolydian: [2, 2, 1, 2, 2, 1, 2], 
        minor: [2, 1, 2, 2, 1, 2, 2],    
        locrian: [1, 2, 2, 1, 2, 2, 2],
        minorPentatonic: [3, 2, 2, 3, 2],
        majorPentatonic: [2, 2, 3, 2, 3],
        minorBlues: [3, 2 ,1 ,1 ,3 , 2],
        majorBlues: [2, 1, 1, 3, 2, 3],
        phrygianDominant: [1, 3, 1, 2, 1, 2, 2],
        harmonicMinor: [2, 1, 2, 2, 1, 3, 1],
        melodicMinor: [2, 1, 2, 2, 2, 2, 1],
    };

    const pattern = scalePatterns[scaleType];
    if (!pattern) throw new Error(`Scale type '${scaleType}' is not recognized.`);

    const startIndex = chromaticScale.indexOf(startNote);
    if (startIndex === -1) throw new Error(`Start note '${startNote}' is not recognized.`);

    let scale = [startNote];
    let currentIndex = startIndex;

    for (let interval of pattern) {
        currentIndex = (currentIndex + interval) % chromaticScale.length;
        scale.push(chromaticScale[currentIndex]);
    }

    return scale;
}

function scales(note, scale){
    if(isToggled !== false){
        toggler();
        wasToggled = true;
    }
    clean(grey);
    
    let notes = generateScale(note.value, scale.value);
    let listScale = document.getElementById("listScale");
    
    let updatedNotes = notes.slice(0, -1);
    // Remove commas, add extra spacing
    listScale.innerHTML = updatedNotes.join(' &nbsp;&nbsp;&nbsp; ');
    
    for (let i = 0; i < notes.length; i++) {
        let things = document.querySelectorAll('.' + notes[i]);
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

    if(wasToggled === true){
        toggler();
    }
}

function doubleScale(note, scale){
    simpleColors();
    if(isToggled !== false){
        toggler();
        wasToggled = true;
    }
    
    let notes = generateScale(note.value, scale.value);
    let listScale = document.getElementById("listScale");
    
    let updatedNotes = notes.slice(0, -1);
    listScale.innerHTML = updatedNotes.join(' &nbsp;&nbsp;&nbsp; ');
    
    for (let i = 0; i < notes.length; i++) {
        let things = document.querySelectorAll('.' + notes[i]);
        things.forEach(function(element) {
            if(notes[i] === note.value){
                element.style.backgroundColor = red;
            }else if(element.style.backgroundColor !== grey && element.style.backgroundColor !== red && element.style.backgroundColor !== ""){
                element.style.backgroundColor = 'purple';
            }else {
                element.style.backgroundColor = green;
            }
        });
    }

    if(wasToggled === true){
        toggler();
    }
}

function remove(){
    let note = document.getElementById("note");
    let scale = document.getElementById("scale");
    if(note.value !== "null" && scale.value !== "null"){
        scales(note, scale);
    }

    let ui = document.getElementById("ui2");
    ui.remove();
}

function simpleColors(){
    const dots = document.querySelectorAll('.dot');
    if(isSimple === false){
        isSimple = true;
        dots.forEach(dot => {
            if (dot.style.backgroundColor === blue || dot.style.backgroundColor === yellow || dot.style.backgroundColor === orange){
                dot.style.backgroundColor = green;
            }
        });
    }else{
        scales(document.getElementById('note'), document.getElementById('scale'));
        isSimple = false;
    }
}

// Initialize the fretboard to sync the JS and CSS on first load
window.addEventListener('DOMContentLoaded', () => {
    clean(grey);
});