function mycolor(){
    for(let i = 0; i < 72; i++){
    document.getElementById("dot").style.backgroundColor = "blue";
    }
}

function getScale(scale){
    const scales = new Map([
        ["Aminor", ["A", "C", "D", "E", "G"]],
        ["Cminor", ["C", "Eb", "F", "G", "Bb"]],
        ["Amajor", ["A", "B", "Db", "D", "E", "Gb", "Ab"]],
        ["Chromatic", ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"]]
    ]);
    return scales.get(scale);
}


const Aminor = [
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]
]
const matrices = {
    Aminor: [
        [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]
    ],
    matrixB: [
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2]
    ],
    matrixC: [
        [5, 4, 3],
        [2, 1, 0],
        [9, 8, 7]
    ]
}


function clean(color) {
    // Get all elements with the class 'dot'
    const dots = document.querySelectorAll('.dot');
    
    // Loop through each dot and set the background color
    dots.forEach(dot => {
        dot.style.backgroundColor = color;
    });
}

function decode(scale){
    clean('#bbb');
    const matrices = {
        Aminor: [
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]
        ],
        Cminor: [
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0]
        ],
        matrixC: [
            [5, 4, 3],
            [2, 1, 0],
            [9, 8, 7]
        ]
    }
    const pee = scale.value;
    const matrix = matrices[pee];
    console.log(matrix);
    console.log(pee);

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if(matrix[i][j] === 1){
                let elementId = `${i},${j}`;
                let dot = document.getElementById(elementId);
                dot.style.backgroundColor="blue";
            } 

            if(matrix[i][j] === 2){
                let elementId = `${i},${j}`;
                let dot = document.getElementById(elementId);
                dot.style.backgroundColor="red";
            }
            // console.log(`Element at [${i}][${j}]: ${matrix[i][j]}`);
        }
    }
}

let isToggled = false;

function toggler() {
    let dots = document.querySelectorAll('.dot');

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
            } else {
                element.style.opacity = '0.8';
                isToggled = false; // Make it fully visible
            }
        }
    });
}



function generateScale(startNote, scaleType) {
    // Chromatic scale: all possible notes in one octave
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
        minorPentatonic: [3, 2, 2, 3, 2]    
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
    let wasToggled = false;
    if(isToggled !== false){
        toggler();
        wasToggled = true;
    }
    clean('#bbb');
    
   
    let notes = generateScale(note.value, scale.value);

    //let notes = getScale(scale.value);
    //console.log(getScale(notes));
    // notes is the list of notes in the scale
    // let one = document.querySelectorAll('.' + notes[0]);
    // let two = document.querySelectorAll('.' + notes[1]);
    // let three = document.querySelectorAll('.' + notes[3]);

    
    for (let i = 0; i < notes.length; i++) {
        let things = document.querySelectorAll('.' + notes[i]);
        console.log('Selected elements for', notes[i], things);
        things.forEach(function(element) {
            if(notes[i] === note.value){
            element.style.backgroundColor = 'yellow';
            }else{
                element.style.backgroundColor = "green";
            }
        });
    }

    if(wasToggled === true){
        toggler();
    }

    

}