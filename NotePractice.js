let running = false;
let run;
function start(){
    
    let time = document.getElementById("time").value;
    running = true;
    swap();

    run = setInterval(swap, time);
}

function dynamicStart(){
    
    if (running){
        clearInterval(run);
        start();
    }
}

function swap(){
    const natural = ["A", "B", "C", "D", "E", "F", "G"];
    const sharps = ["A#", "C#", "D#", "F#","G#"];
    const flats = ["Ab", "Bb", "Db", "Eb", "Gb"];
    let sharpsBox = document.getElementById("sharps");
    let naturalBox = document.getElementById("natural");
    let flatsBox = document.getElementById("flats");
    let notes = [];
    
    if (naturalBox.checked){
        notes = notes.concat(natural);
        
    }
    if (sharpsBox.checked){
        notes = notes.concat(sharps);
    }
    if(flatsBox.checked){
        notes = notes.concat(flats);
    }

    let customNotes = document.querySelectorAll(".noteCheckbox");

    customNotes.forEach(function(element){
        if (element.checked){
            let foo = element.value;
            notes = notes.concat(foo);
        }
    })

    if(running === true){
    let displayNote = document.querySelector('.displayNote');
    displayNote.innerHTML = notes[getRandomInt(notes.length)];
    console.log(notes);
    }
    
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function stop(){
    running = false;
    clearInterval(run);
}