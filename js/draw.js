
let drawStyle = {
    color: 'black',
    size: 5,
    type: 'pen',
    fill: '1',
    canDraw: false
};

function drawPicture() {
    draw().drawBuild('temporary');
    draw().buildCanvas(canvasImg);
}

function drawChangeValue(type, event) {
    drawStyle[type] = event.value;
}

function draw() {
    function drawBuild(rootId) {
        let root = document.getElementById(rootId);
        let div = document.createElement('div');
        let pen = document.createElement('div');
        let line = document.createElement('div');
        let circle = document.createElement('div');
        let block = document.createElement('block');
        let cancel = document.createElement('div');
        let cutBox = document.createElement('div');
        cutBox.className = 'chooseBox';
        cutBox.style.width = '100%';
        pen.innerText = '铅笔';
        line.innerText = '直线';
        circle.innerText = '圆';
        block.innerText = '矩形';
        cancel.innerText = '✘';
        [pen, line, circle, block, cancel].forEach((item)=>{
            item.className = 'baseBtn';
            cutBox.appendChild(item);
        });
        cutBox.addEventListener('click',function (e) {
            [pen, line, circle, block, cancel].forEach((item)=>{
                item.className = 'baseBtn';
            });
            e.target.className = 'baseBtn on';
            if (e.target.innerText === '✘') {
                root.removeChild(div);
            } else if (e.target.innerText.length < 3) {
                drawStyle['type'] = e.target.innerText;
                drawStyle.canDraw = true;
            }
        });
        div.appendChild(cutBox);
        root.appendChild(div);
    }

    function buildCanvas(canvas) {
        let drawState = false;
        let content = canvas.getContext('2d');

        canvas.addEventListener('mousedown', function () {
            if (drawStyle.canDraw) {
                drawState = true
            }
        });

        canvas.addEventListener('mouseup', function () {
            if (drawStyle.canDraw) {
                drawState = false;
                drawImg.clean();
                delAddArr(img_url, img, canvas.toDataURL(`image/png`, 0.97));
                img.src = img_url[img_url.length - 1];
            }
        });

        canvas.addEventListener('mousemove', function (e) {
            if (drawStyle.canDraw && drawState) {
                drawImg.draw(e)
            }
        });

        function Ellipse(context, x, y, a, b) {
            let step = (a > b) ? 1 / a : 1 / b;
            context.beginPath();
            context.moveTo(x + a, y);
            for(let i = 0; i < 2 * Math.PI; i += step) {
                context.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
            }
        }

        let drawImg = (function() {
            let begin = null;
            return {
                draw: function (e) {
                    if (!begin) {
                        begin = {
                            x: e.offsetX,
                            y: e.offsetY
                        }
                    }
                    if (drawStyle.type === '铅笔') {
                        content.beginPath();
                        content.strokeStyle = drawStyle.color;
                        content.lineWidth = drawStyle.size;
                        content.lineCap = 'round';
                        content.moveTo(begin.x, begin.y);
                        content.lineTo(e.offsetX, e.offsetY);
                        content.stroke();
                        content.closePath();
                        begin = {
                            x: e.offsetX,
                            y: e.offsetY
                        }
                    } else if (drawStyle.type === '直线') {
                        content.clearRect(0 , 0, canvas.width, canvas.height);
                        content.drawImage(img, 0, 0, canvas.width, canvas.height);
                        content.beginPath();
                        content.strokeStyle = drawStyle.color;
                        content.lineWidth = drawStyle.size;
                        content.lineCap = 'round';
                        content.moveTo(begin.x, begin.y);
                        content.lineTo(e.offsetX, e.offsetY);
                        content.stroke();
                        content.closePath();
                    } else if (drawStyle.type === '圆') {
                        content.clearRect(0 , 0, canvas.width, canvas.height);
                        content.drawImage(img, 0, 0, canvas.width, canvas.height);
                        content.beginPath();
                        content.strokeStyle = drawStyle.color;
                        content.lineWidth = drawStyle.size;
                        content.lineCap = 'round';
                        Ellipse(content, begin.x, begin.y, (e.offsetX - begin.x)/2, (e.offsetY - begin.y)/2);
                        if (drawStyle.fill === '1') {
                            content.fill()
                        } else {
                            content.stroke()
                        }
                        content.closePath();
                    } else if (drawStyle.type === '矩形') {
                        content.clearRect(0 , 0, canvas.width, canvas.height);
                        content.drawImage(img, 0, 0, canvas.width, canvas.height);
                        content.beginPath();
                        content.strokeStyle = drawStyle.color;
                        content.lineWidth = drawStyle.size;
                        content.lineCap = 'round';
                        content.rect(begin.x, begin.y, e.offsetX - begin.x, e.offsetY - begin.y);
                        if (drawStyle.fill === '1') {
                            content.fill()
                        } else {
                            content.stroke()
                        }
                        content.closePath();
                    }
                },
                clean: function () {
                    begin = null
                }
            }
        })();

    }
    return {
        drawBuild: drawBuild,
        buildCanvas: buildCanvas
    }
}