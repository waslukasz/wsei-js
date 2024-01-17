const app = document.querySelector('#app');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
app.append(canvas);

InitiateApp();

function InitiateApp() {
    // SETTINGS
    const START_POINT_COUNT = 100;
    const POINT_SIZE = 3.5;
    const LINE_WIDTH = 1;

    const AVG_SPEED = 0;
    const MIN_SPEED = .05;
    const SPEED_DISPROPORTION = .5;

    const CONNECT_IF_CLOSE = true;
    const DISTANCE_TO_CONNECT = 100;

    const DRAW_POINT_COUNT = true;
    const DRAW_FPS = true;

    const FPS_MAX = 60;
    const LIMIT_FPS = false;

    const COLOR_POINT = '#2D5D7B';
    const COLOR_BG = '#333';
    const COLOR_LINE = '#457EAC33';

    // CODE
    let paused = true;
    let lastRenderTime;
    let fps;

    let point_count = START_POINT_COUNT;
    let points = [];

    window.addEventListener('resize', () => {
        ctx.canvas.height = window.innerHeight;
        ctx.canvas.width = window.innerWidth;
        MIN_DISTANCE_TO_HOLE = Math.min([ctx.canvas.height/5, ctx.canvas.width/5])
    });

    ctx.canvas.height = window.innerHeight;
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.style.background = COLOR_BG;

    AddControls();

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (CONNECT_IF_CLOSE) DrawProximityLine();
        DrawPoints();
        if (DRAW_POINT_COUNT) DrawPointCount();
        if (DRAW_FPS) DrawFPS();
    }

    function DrawPoints() {
        UpdatePointCount();

        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            DrawPoint(point);
        }

        function DrawPoint(point) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
            ctx.fillStyle = point.color;
            ctx.fill();
            ctx.closePath();
            if(!paused) UpdatePointPosition(point);
        }

        function UpdatePointPosition(point) {
            if ((point.x + point.speedX) > ctx.canvas.width - point.size) {
                point.x = ctx.canvas.width - point.size;
                point.speedX *= -1;
            }
            else if ((point.x + point.speedX) < 0 + point.size) {
                point.x = point.size;
                point.speedX *= -1;
            }
            else point.x += point.speedX;

            if ((point.y + point.speedY) > ctx.canvas.height - point.size) {
                point.y = ctx.canvas.height - point.size;
                point.speedY *= -1;
            }
            else if ((point.y + point.speedY) < 0 + point.size) {
                point.y = point.size;
                point.speedY *= -1;
            }
            else point.y += point.speedY;
        }
    }

    function DrawProximityLine() {
        for (let i = 0; i < points.length; i++) {
            const point = points[i];

            for (let j = 0; j < points.length; j++) {
                const target = points[j];
                if (point == target) continue;
                
                if(IsClose(point, target)) {
                    DrawLine(point, target);
                }
            }            
        }

        function DrawLine(point, target) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = COLOR_LINE;
            ctx.lineWidth = LINE_WIDTH;
            ctx.stroke();
            ctx.closePath();
        }

        function IsClose(point, target) {
            let dx = Math.abs(target.x - point.x);
            let dy = Math.abs(target.y - point.y);
            var distance = Math.sqrt((dx * dx) + (dy * dy));
            
            if (distance <= DISTANCE_TO_CONNECT) return true;
            return false;
        }
    }

    function DrawPointCount() {
        ctx.beginPath();
        ctx.font = "32px serif";
        ctx.fillStyle = '#fff';
        ctx.fillText(`Point count: ${point_count}`, 10, 50);
        ctx.closePath();
    }

    function DrawFPS() {
        if(!lastRenderTime) {
            lastRenderTime = Date.now();
            fps = 0;
            return;
        }
        delta = (Date.now() - lastRenderTime)/1000;
        lastRenderTime = Date.now();
        fps = Math.floor(1/delta);

        ctx.beginPath();
        ctx.font = "32px serif";
        ctx.fillStyle = '#fff';
        ctx.fillText(`FPS: ${fps}`, 10, 82);
        ctx.closePath();
    }

    function UpdatePointCount() {
        if (point_count > points.length) {
            for (let i = 0; i < point_count - points.length; i++) {
                GeneratePoint();
            }
        }
        
        if (point_count < points.length) {
            for (let i = 0; i < points.length - point_count; i++) {
                RemovePoint();
            }
        }

        if(!paused && LIMIT_FPS) {
            if(fps < FPS_MAX) {
                point_count--;
            }
            if(fps > FPS_MAX) {
                point_count++;
            }
        }

    }

    function GeneratePoint() {
        let point = {
            size: POINT_SIZE,
            x: 0,
            y: 0,
            speedX: 0,
            speedY: 0,
            color: COLOR_POINT
        }
        while (point.speedX < MIN_SPEED && point.speedX > -MIN_SPEED) {
            point.speedX = Math.random() * ((AVG_SPEED + SPEED_DISPROPORTION) - (AVG_SPEED - SPEED_DISPROPORTION)) + (AVG_SPEED - SPEED_DISPROPORTION);
        }

        while (point.speedY < MIN_SPEED && point.speedY > -MIN_SPEED) {
            point.speedY = Math.random() * ((AVG_SPEED + SPEED_DISPROPORTION) - (AVG_SPEED - SPEED_DISPROPORTION)) + (AVG_SPEED - SPEED_DISPROPORTION);
        }

        point.x = Math.random() * ((ctx.canvas.width - point.size) - point.size) + point.size;
        point.y = Math.random() * ((ctx.canvas.height - point.size) - point.size) + point.size;
        points.push(point);
    }

    function RemovePoint() {
        points.pop();
    }

    function AddControls() {
        const start = document.createElement('button');
        const restart = document.createElement('button');

        start.innerText = 'START';
        restart.innerText = 'RESTART';

        start.style.position = 'absolute';
        restart.style.position = 'absolute';
        start.style.top = '20px';
        start.style.right = '200px';
        restart.style.top = '20px';
        restart.style.right = '120px';

        start.addEventListener('click', () => paused = false);
        restart.addEventListener('click', () => {
            point_count = START_POINT_COUNT;
            points = [];
            paused = true;
        })

        app.append(start, restart);
    }

    requestAnimationFrame(animate)
}