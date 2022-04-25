const yourShip = document.querySelector('.play-shooter'); //2
const playArea = document.querySelector('#main-play-area'); //2
const aliensImg = ['img/monster-1.png','img/monster-2.png','img/monster-3.png'];

const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;
var pontos = 0;
function flyShip(event) { 
    if(event.key==='ArrowUp') {
        event.preventDefault();
        moveUp();        
    } else if(event.key==='ArrowDown') {
        event.preventDefault();
        moveDown();        
    } else if(event.key===" ") {
        event.preventDefault();
        fireLaser();
    }    
}

function moveUp() { //2
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition==="0px") {
        return
    } else {
        let position = parseInt(topPosition);
        position -= 25;
        yourShip.style.top = `${position}px`;
    }    
}

function moveDown() { // 3
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition==="510px"){
        return
    } else {
        let position = parseInt(topPosition);
        position += 25 ;
        yourShip.style.top = `${position}px`;
    }    
}

// Função de disparo
function fireLaser() { // 4
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}
function moveLaser(laser) { // 5
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');
        // comparando se cada alien foi atingido 
            aliens.forEach((alien) => { 
            if(checkLaserCollision(laser,alien)) {
                 alien.src = 'img/explosion.png';
                 alien.classList.remove('alien');
                 alien.classList.add('dead-alien');
            }
        })
        
        if(xPosition===340){
            laser.remove();
        } else{
            laser.style.left = `${xPosition + 8}px` ;
        }
    }, 10);
}
// Função para criar um alien aleatório 
function createAliens() { // 6
    let newAlien = document.createElement('img');
    let nAlien = Math.floor(Math.random() * aliensImg.length);
    //let alienSprit = aliensImg[Math.floor(Math.random() * aliensImg.length)];
    let alienSprit = aliensImg[nAlien];
    newAlien.src = alienSprit;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.classList.add(`alien-${nAlien}`);
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) +30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

// Função para mofvimentar os aliens
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if (xPosition<=25) {
            if (Array.from(alien.classList).includes('dead-alien')) {
                if (alien.classList.contains('alien-0')) {
                    pontos += 10;                    
                } else if (alien.classList.contains('alien-1')) {
                    pontos += 20;                    
                } else if (alien.classList.contains('alien-2')) {
                    pontos += 30;                    
                }
                document.getElementById('pontos').innerHTML = pontos;
                alien.remove();                
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    },30);
    
}

// Funcção para colizsão
function checkLaserCollision(laser, alien) { // 7
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;

    if(laserLeft!=340 && laserLeft+40>=alienLeft) {
        if(laserTop<=alienTop && laserTop>=alienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

startButton.addEventListener('click', (event) => {
    playGame();
})

function playGame() {
    startButton.style.display = 'none';
     instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert('Game over!!!!\n  Pontos:'+ pontos);

        yourShip.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });
}
