const img_id = 'picture';
let img = null;
let canvasImg = document.getElementById('imgCanvas');

let cutImg = (function () {
    let imgBox = document.getElementById('imgBox');
    let canvas = null;
    return () => {
        if (canvas || !img) return;
        let create = createCanvas(canvasImg, 'cut');
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
            cutImgChange(create.cutArea);
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
    img.src = canvas.toDataURL(`image/png`, 0.97);
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
                _img.src = evt.target.result;
            } else {
                img.src = evt.target.result;
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