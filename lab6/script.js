window.addEventListener('deviceorientation', onDeviceMove);

const boardSize = 300 - 20;
console.log(boardSize);

let ballX = 0;
let ballY = 0;

function onDeviceMove(event) {
    setInterval(() => {
        UpdateBallCoordinates(event.beta, event.gamma);
        animate()
        console.log('xd')
    }, 16);
}

function animate() {
    const ball = document.querySelector('#ball');
    ball.style.transform = `translate(${ballX}px, ${ballY}px)`;
}

requestAnimationFrame(animate)

function UpdateBallCoordinates(beta, gamma) {
    //beta 180 gd, gamma 90 lp
    
    if (beta > 20) {
        console.log(beta)
        if (ballY+2 <= boardSize) {
            ballY +=2;
        } else if (ballY+1 <= boardSize) {
            ballY +=1;
        }
    } else if (beta > 10) {
        if (ballY+1 <= boardSize) {
            ballY +=1;
        }
    } else if (beta < -20) {
        if (ballY-2 >= 0) {
            ballY -=2;
        } else if (ballY-1 >= 0) {
            ballY -=1;
        }
    } else if (beta < -10) {
        if (ballY-1 >= 0) {
            ballY -=1;
        }
    }

    if (gamma > 20) {
        console.log(gamma)
        if (ballX+2 <= boardSize) {
            ballX +=2;
        } else if (ballX+1 <= boardSize) {
            ballX +=1;
        }
    } else if (gamma > 10) {
        if (ballX+1 <= boardSize) {
            ballX +=1;
        }
    } else if (gamma < -20) {
        if (ballX-2 >= 0) {
            ballX -=2;
        } else if (ballX-1 >= 0) {
            ballX -=1;
        }
    } else if (gamma < -10) {
        if (ballX-1 >= 0) {
            ballX -=1;
        }
    }
}