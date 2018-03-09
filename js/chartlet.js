function chartlet(canvasImg, obj, id, style) {
    let objArea = {
        x: canvasImg.width * 0.25,
        y: canvasImg.height * 0.25,
        p: canvasImg.width * 0.5,
        q: canvasImg.height * 0.5,
    };

    let canvasStatus = {
        canMove: false,
        canStretch: false,
    };

    const canvas = document.createElement('canvas');
    canvas.width = canvasImg.width;
    canvas.height = canvasImg.height;
    if (id) canvas.id = id;
    let content = canvas.getContext('2d');
    content.save();

    function addText(content, obj, objArea) {
        content.clearRect(0, 0, canvas.width, canvas.height);
        if (obj.text) {
            content.font = `${objArea.q*1.3}px ${style.family}`;
            content.fillStyle = content.strokeStyle = style.color;
            content.fillText(obj.text, objArea.x, objArea.y + objArea.q, objArea.p);
            content.strokeRect(objArea.x, objArea.y, objArea.p, objArea.q);
        } else {
            let img = new Image();
            img.src = obj.url;
            content.drawImage(img, objArea.x, objArea.y, objArea.p, objArea.q);
        }
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

    canvas.addEventListener('mousedown', function (event) {
        if (judgePosition(event.offsetX, event.offsetY, objArea)) {
            canvasStatus.canMove = boundaryValueTesting(event.offsetX, event.offsetY, objArea) === 'move';
            canvasStatus.canStretch = boundaryValueTesting(event.offsetX, event.offsetY, objArea);
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
        if (judgePosition(event.offsetX, event.offsetY, objArea)) {
            this.style.cursor = boundaryValueTesting(event.offsetX, event.offsetY, objArea);
        } else {
            this.style.cursor = 'default';
        }
        if (canvasStatus.canMove) {
            objArea.x = objArea.x + event.movementX >= 0 ? objArea.x + event.movementX : 0;
            objArea.x = objArea.x >= canvas.width - objArea.p ? canvas.width - objArea.p : objArea.x;
            objArea.y = objArea.y + event.movementY >= 0 ? objArea.y + event.movementY : 0;
            objArea.y = objArea.y >= canvas.height - objArea.q ? canvas.height - objArea.q : objArea.y;
            addText(content, obj, objArea)
        }
        else if (canvasStatus.canStretch) {
            if (canvasStatus.canStretch.indexOf('n') > -1 && canvasStatus.canStretch.indexOf('n') < 3) {
                if (objArea.q > 1) {
                    objArea.y = objArea.y + event.movementY >= 0 ? objArea.y + event.movementY : 0;
                }
                objArea.q = objArea.q - event.movementY;
                objArea.q = objArea.q > 1 ? objArea.q : 1 ;
            }
            if (canvasStatus.canStretch.indexOf('w') > -1 && canvasStatus.canStretch.indexOf('w') < 3) {
                if (objArea.p > 1) {
                    objArea.x = objArea.x + event.movementX >= 0 ? objArea.x + event.movementX : 0;
                }
                objArea.p = objArea.p - event.movementX;
                objArea.p = objArea.p > 1 ? objArea.p : 1 ;
            }
            if (canvasStatus.canStretch.indexOf('e') > -1 && canvasStatus.canStretch.indexOf('e') < 3) {
                objArea.p = objArea.p + event.movementX;
                objArea.p = objArea.p > 1 ? objArea.p : 1 ;
            }
            if (canvasStatus.canStretch.indexOf('s') > -1 && canvasStatus.canStretch.indexOf('s') < 3) {
                objArea.q = objArea.q + event.movementY;
                objArea.q = objArea.q > 1 ? objArea.q : 1 ;
            }
            addText(content, obj, objArea)
        }
    });
    addText(content, obj, objArea);
    return {
        canvas: canvas,
        obj: {
            fn: addText,
            value: obj,
            objArea: objArea
        }
    }
}