let timer; // keeps track of game time
let score = 0; // keeps track of game score

// HTML elements
let gameWindow = document.getElementById('game-window');
let clock = document.getElementById('timer-value');
let scoreElement = document.getElementById('score-value');
const holeElements = document.getElementsByClassName('hole-image');
const moleElements = document.getElementsByClassName('mole-image');

// used to keep track of all timeouts' and intervals' IDs
let intervalInterrupt;
let gameInterrupt;
let gameStart;
let moleInterrupts = [ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

// keeps track of holes without a mole peeking from
let emptyHoles = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];

window.addEventListener('load', countDown);
document.getElementById('reset-button').addEventListener('click', resetGame)

function countDown() {
    timer = 20; // set the game timer here
    clock.innerHTML = timer;

    removeClickEvents();
    addClickEvents();

    // start the game
    gameStart = setTimeout(moleAppear, 500);

    // handles clock ticks
    intervalInterrupt = setInterval(function() {
        timer -= 1;
        clock.innerHTML = timer;
        console.log("clock tick")

        // handles clock timeout
        if(timer == 0) {
            // blurry game window
            document.getElementById('container').classList.toggle('blurred');
            removeClickEvents();
            interruptAll();
        }

    }, 1000);
}

// add event to the mole <img /> elements
function addClickEvents() {
    for(let i = 0; i < moleElements.length; i++) 
        moleElements[i].addEventListener('click', function onClick() {
            whackAMole(i);
        });
}

// remove event from the mole <img /> elements
function removeClickEvents() {
    for(let i = 0; i < moleElements.length; i++) {
        // the event is removed by replacing the HTML elements with their copies
        let new_node = moleElements[i].cloneNode(true);
        moleElements[i].parentNode.replaceChild(new_node, moleElements[i]);
    }
}

// handles the concurrent appearance and disappearance of moles
function moleAppear() {
    // a mole appears from a hole
    let position = getRandomHole();
    console.log('Mole appears at position: ', position, '; empty holes are:', emptyHoles);
    addAMole(position);

    // a mole disappears from the hole after a random interval 
    moleInterrupts[position] = setTimeout(function() {
        removeAMole(position);
        emptyHoles.push(position);
        moleInterrupts[position] = undefined;
        console.log('Mole disappears from position: ', position, '; empty holes are:', emptyHoles);
    }, getRandomInterval());

    gameInterrupt = setTimeout(moleAppear, getRandomInterval());
}

// returns an index of a hole without a mole peeking from
function getRandomHole() {
    let random1to8 = Math.floor(Math.random() * emptyHoles.length);
    let position = emptyHoles[random1to8];

    // removes the index from the list of holes without a mole peeking from
    emptyHoles = emptyHoles.filter(function(number) {
        return number != position 
    });

    return position;
}

// returns a random interval from 0.5s to 3s
function getRandomInterval() {
    return Math.random() * 2500 + 500;
}

// handles whacking of moles
function whackAMole(position) {
    console.log('WHACK! At position: ', position);
    removeAMole(position);
    emptyHoles.push(position);

    // the mole is dead; no need to remove it twice
    clearTimeout(moleInterrupts[position]);
    moleInterrupts[position] = undefined;

    // update score
    score += 1;
    scoreElement.innerHTML = score;
}

// switches hole image with the mole image
function addAMole(position) {
    if(moleElements[position].classList.contains('invisible'))
        moleElements[position].classList.remove('invisible');

    if(!holeElements[position].classList.contains('invisible'))
        holeElements[position].classList.add('invisible');
}

// switches mole image with the hole image
function removeAMole(position) {
    if(holeElements[position].classList.contains('invisible'))
        holeElements[position].classList.remove('invisible');

    if(!moleElements[position].classList.contains('invisible'))
        moleElements[position].classList.add('invisible');
}

// clears all timeouts and intervals
function interruptAll() {
    clearInterval(intervalInterrupt);
    clearTimeout(gameStart);
    clearTimeout(gameInterrupt);
    for(let i=0; i < moleInterrupts.length; i++)
    {
        console.log('clear timeout at index: ', i);
        clearTimeout(moleInterrupts[i]);
        moleInterrupts[i] = undefined;
    }   
}

function resetGame() {
    interruptAll();
    // return opacity to 1
    if(document.getElementById('container').classList.contains('blurred'))
        document.getElementById('container').classList.toggle('blurred');

    // reset score
    score = 0;
    scoreElement.innerHTML = 0;

    emptyHoles = [0, 1, 2, 3, 4, 5, 6, 7, 8 ];
    moleInterrupts = [ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

    for(let i = 0; i < 9; i++)
        removeAMole(i);

    console.log('The game has been reset')

    // start running the game again
    countDown();
}
