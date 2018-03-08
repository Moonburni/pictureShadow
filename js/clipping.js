function createCanvas(img, id) {

    function getArea(content, obj) {
        content.clearRect(0, 0, canvas.width, canvas.height);
        content.fillStyle = 'rgba(0,0,0,0.6)';
        content.fillRect(0, 0, canvas.width, canvas.height);
        content.clearRect(obj.x, obj.y, obj.p, obj.q)
    }

    function judgePosition(x, y, area) {
        return (area.x <= x && x <= area.p + area.x && area.y <= y && y <= area.q + area.y);
    }

    function boundaryValueTesting(x, y, area) {
        if (Math.abs(x - area.x) < 10 && Math.abs(y - area.y) < 10) return 'nw-resize';
        if (Math.abs(x - area.x) < 10 && Math.abs(y - area.y - area.q) < 10) return 'sw-resize';
        if (Math.abs(x - area.x - area.p) < 10 && Math.abs(y - area.y) < 10) return 'ne-resize';
        if (Math.abs(x - area.x - area.p) < 10 && Math.abs(y - area.y - area.q) < 10) return 'se-resize';
        if (Math.abs(x - area.x) < 10) return 'w-resize';
        if (Math.abs(x - area.x - area.p) < 10) return 'e-resize';
        if (Math.abs(y - area.y) < 10) return 'n-resize';
        if (Math.abs(y - area.y - area.q) < 10) return 's-resize';
        return 'move'
    }

    let cutArea = {
        x: img.width * 0.25,
        y: img.height * 0.25,
        p: img.width * 0.5,
        q: img.height * 0.5
    };

    let canvasStatus = {
        canMove: false,
        canStretch: false
    };

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    if (id) canvas.id = id;
    const context = canvas.getContext('2d');
    getArea(context, cutArea);
    canvas.addEventListener('mousedown', function (event) {
        if (judgePosition(event.offsetX, event.offsetY, cutArea)) {
            canvasStatus.canMove = boundaryValueTesting(event.offsetX, event.offsetY, cutArea) === 'move';
            canvasStatus.canStretch = boundaryValueTesting(event.offsetX, event.offsetY, cutArea);
        }
    });
    canvas.addEventListener('mouseleave', function () {
        canvasStatus.canMove = false;
        canvasStatus.canStretch = false;
    });
    canvas.addEventListener('mouseup', function () {
        canvasStatus.canMove = false;
        canvasStatus.canStretch = false;
    });
    canvas.addEventListener('mousemove', function (event) {
        if (judgePosition(event.offsetX, event.offsetY, cutArea)) {
            this.style.cursor = boundaryValueTesting(event.offsetX, event.offsetY, cutArea);
        } else {
            this.style.cursor = 'default';
        }
        if (canvasStatus.canMove) {
            cutArea.x = cutArea.x + event.movementX >= 0 ? cutArea.x + event.movementX : 0;
            cutArea.x = cutArea.x >= canvas.width - cutArea.p ? canvas.width - cutArea.p : cutArea.x;
            cutArea.y = cutArea.y + event.movementY >= 0 ? cutArea.y + event.movementY : 0;
            cutArea.y = cutArea.y >= canvas.height - cutArea.q ? canvas.height - cutArea.q : cutArea.y;
            getArea(context, cutArea);
        } else if (canvasStatus.canStretch) {
            if (canvasStatus.canStretch.indexOf('n') > -1 && canvasStatus.canStretch.indexOf('n') < 3) {
                if (cutArea.q > 1) {
                    cutArea.y = cutArea.y + event.movementY >= 0 ? cutArea.y + event.movementY : 0;
                }
                cutArea.q = cutArea.q - event.movementY;
                cutArea.q = cutArea.q > 1 ? cutArea.q : 1 ;
            }
            if (canvasStatus.canStretch.indexOf('w') > -1 && canvasStatus.canStretch.indexOf('w') < 3) {
                if (cutArea.p > 1) {
                    cutArea.x = cutArea.x + event.movementX >= 0 ? cutArea.x + event.movementX : 0;
                }
                cutArea.p = cutArea.p - event.movementX;
                cutArea.p = cutArea.p > 1 ? cutArea.p : 1 ;
            }
            if (canvasStatus.canStretch.indexOf('e') > -1 && canvasStatus.canStretch.indexOf('e') < 3) {
                cutArea.p = cutArea.p + event.movementX;
                cutArea.p = cutArea.p > 1 ? cutArea.p : 1 ;
            }
            if (canvasStatus.canStretch.indexOf('s') > -1 && canvasStatus.canStretch.indexOf('s') < 3) {
                cutArea.q = cutArea.q + event.movementY;
                cutArea.q = cutArea.q > 1 ? cutArea.q : 1 ;
            }
            getArea(context, cutArea);
        }
    });
    return {
        canvas: canvas,
        cutArea: cutArea
    }
}