const img_id = 'picture';
let img_url = [];
let img = null;
let canvasImg = document.getElementById('imgCanvas');

let cutImg = (function () {
    let imgBox = document.getElementById('imgBox');
    let canvas = null;
    return (type, obj) => {
        if (canvas || !img) return;
        let create = type === 'cut' ? createCanvas(canvasImg, 'cut') : chartlet(canvasImg, obj, 'cut');
        canvas = create.canvas;
        let confirm = document.createElement('div');
        let cancel = document.createElement('div');
        let cutBox = document.createElement('div');
        cutBox.className = 'cutBox';
        confirm.innerText = '✔';
        confirm.className = 'baseBtn';
        cancel.className = 'baseBtn';
        cancel.innerText = '✘';
        cutBox.appendChild(confirm);
        cutBox.appendChild(cancel);
        confirm.addEventListener('click',function () {
            if (type === 'cut') {
                cutImgChange(create.cutArea);
            } else {
                addImgChange(create.obj, canvasImg)
            }
            imgBox.removeChild(canvas);
            imgBox.removeChild(cutBox);
            canvas = null;
        });
        cancel.addEventListener('click',function () {
            imgBox.removeChild(canvas);
            imgBox.removeChild(cutBox);
            canvas = null;
        });
        imgBox.appendChild(canvas);
        imgBox.appendChild(cutBox);
    }
})();

function addImgChange(obj, canvas) {
    let content = canvas.getContext('2d');
    let objArea = obj.objArea;
    let text = obj.value;
    content.font = `${objArea.q*1.3}px serif`;
    content.rotate(objArea.r* Math.PI / 180);
    content.fillText(text, objArea.x, objArea.y + objArea.q, objArea.p);
    content.strokeRect(objArea.x, objArea.y, objArea.p, objArea.q);
    delAddArr(img_url, img, canvas.toDataURL(`image/png`, 0.97));
    img.src = img_url[img_url.length - 1];
}

function cutImgChange(area) {
    let imgBox = document.getElementById('imgBox');
    let canvas = document.createElement('canvas');
    let content = canvas.getContext('2d');
    let rate = area.p / area.q;
    if (rate <= 1) {
        canvas.height = parseInt(getComputedStyle(imgBox).height) * 0.8;
        canvas.width = parseInt(getComputedStyle(imgBox).height) * 0.8 * rate;
    } else {
        canvas.width = parseInt(getComputedStyle(imgBox).width) * 0.8;
        canvas.height = parseInt(getComputedStyle(imgBox).width) * 0.8 / rate;
    }
    content.drawImage(img,
        (img.width*area.x/canvasImg.width) >>> 0,
        (img.height*area.y/canvasImg.height) >>> 0,
        (img.width*area.p/canvasImg.width) >>> 0,
        (img.height*area.q/canvasImg.height) >>> 0,
        0, 0, canvas.width, canvas.height);
    delAddArr(img_url, img, canvas.toDataURL(`image/png`, 0.97));
    img.src = img_url[img_url.length - 1];
}


function stringAdd(oldStr, style, value) {
    if (oldStr) {
        if (oldStr.indexOf(style) >= 0) {
            let reg = new RegExp(`(.*${style}[\(])([^\)]*)([\)].*)`);
            return oldStr.replace(reg, '$1' + value + '$3');
        } else {
            return `${oldStr} ${style}(${value})`;
        }
    } else {
        return `${style}(${value})`;
    }
}

function getPicture(file) {
    if (file.files && file.files[0]) {
        let reader = new FileReader();
        reader.onload = function (evt) {
            if (!img) {
                let imgBox = document.getElementById('imgBox');
                let _img = new Image();
                _img.onload = function () {
                    _img.id = img_id;
                    _img.name = file.files[0].name;
                    img = _img;
                    const content = canvasImg.getContext('2d');
                    let rate = _img.width / _img.height;
                    if (rate <= 1) {
                        canvasImg.height = parseInt(getComputedStyle(imgBox).height) * 0.8;
                        canvasImg.width = parseInt(getComputedStyle(imgBox).height) * 0.8 * rate;
                    } else {
                        canvasImg.width = parseInt(getComputedStyle(imgBox).width) * 0.8;
                        canvasImg.height = parseInt(getComputedStyle(imgBox).width) * 0.8 / rate;
                    }
                    content.drawImage(_img, 0, 0, canvasImg.width, canvasImg.height);
                };
                delAddArr(img_url, img, evt.target.result);
                _img.src = img_url[img_url.length - 1];
            } else {
                delAddArr(img_url, img, evt.target.result);
                img.src = img_url[img_url.length - 1];
            }
        };
        reader.readAsDataURL(file.files[0]);
    }
}

function clearNum() {
    [...document.getElementById('selectBox').children]
        .map(label => label.children)
        .forEach((input) => {
            if (input[0]) input[0].value = '0';
            if (img) canvasImg.style.filter = '';
        })
}

function changeNum(type, e) {
    if (type === 'grey') {
        if (img) canvasImg.style.filter = stringAdd(canvasImg.style.filter, 'grayscale', `${e.value}%`);
    } else if (type === 'blur') {
        if (img) canvasImg.style.filter = stringAdd(canvasImg.style.filter, 'blur', `${e.value}px`);
    } else if (type === 'contrast') {
        if (img) canvasImg.style.filter = stringAdd(canvasImg.style.filter, 'contrast', `${e.value}%`);
    } else if (type === 'hue-rotate') {
        if (img) canvasImg.style.filter = stringAdd(canvasImg.style.filter, 'hue-rotate', `${e.value}deg`);
    } else if (type === 'invert') {
        if (img) canvasImg.style.filter = stringAdd(canvasImg.style.filter, 'invert', `${e.value}%`);
    } else if (type === 'sepia') {
        if (img) canvasImg.style.filter = stringAdd(canvasImg.style.filter, 'sepia', `${e.value}%`);
    } else if (type === 'saturate') {
        if (img) canvasImg.style.filter = stringAdd(canvasImg.style.filter, 'saturate', `${e.value}%`);
    } else if (type === 'opacity') {
        if (img) canvasImg.style.filter = stringAdd(canvasImg.style.filter, 'opacity', `${e.value}%`);
    } else if (type === 'brightness') {
        if (img) canvasImg.style.filter = stringAdd(canvasImg.style.filter, 'brightness', `${e.value}%`);
    }
}

function downloadPicture() {
    if (img) {
        download(canvasImg, img).changeImage.download()
    }
}

function delAddArr(arr, item, add) {
    if (arr.length > 0) {
        arr.splice(arr.indexOf(item.src) + 1, arr.length - arr.indexOf(item.src) - 1, add)
    } else {
        arr.push(add)
    }
}

function go(type) {
    if (type) {
        if (img_url.indexOf(img.src) > 0) {
            img.src = img_url[img_url.indexOf(img.src) - 1];
        }
    } else {
        if (img_url.indexOf(img.src) + 1 < img_url.length) {
            img.src = img_url[img_url.indexOf(img.src) + 1];
        }
    }
}

function mapImg() {
    cutImg('map', {text: 'design by moonburn'})
}