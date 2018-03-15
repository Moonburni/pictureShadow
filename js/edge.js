function getEdge(canvas, rate) {
    let content = canvas.getContext('2d');
    let imageData = content.getImageData(0, 0, canvas.width, canvas.height);
    let width = imageData.width*4,
        height = imageData.height,
        data = imageData.data,
        length = data.length;
    let edgeArr = [];

    function judgeSimilarColor(color1, color2) {
        if (color1 && color2) {
            return Math.abs(color1[0] - color2[0]) < rate
                && Math.abs(color1[1] - color2[1]) < rate
                && Math.abs(color1[2] - color2[2]) < rate
        }
        return false
    }

    function judgeEg(color, rightColor, leftColor, topColor, bottomColor) {
        let i = 0;
        if (!judgeSimilarColor(color, rightColor)) i++;
        if (!judgeSimilarColor(color, leftColor)) i++;
        if (!judgeSimilarColor(color, topColor)) i++;
        if (!judgeSimilarColor(color, bottomColor)) i++;
        return i > 2
    }

    for(let i = 0; i < length; i = i + 4) {
        let leftColor, color, rightColor, bottomColor, topColor;
        color = [data[i], data[i + 1], data[i + 2], data[i + 3]];
        if (i / (width) > 1) {
            topColor = [data[i - 4 - width], data[i - 3 - width], data[i - 2 - width], data[i - 1 - width]]
        }
        if (i % (width) !== 0) {
            leftColor = [data[i - 4], data[i - 3], data[i - 2], data[i - 1]];
        }
        if (i % (width) !== width*4 - 1) {
            rightColor = [data[i], data[i + 1], data[i + 2], data[i + 3]];
        }
        if (i / (width) < height - 1) {
            bottomColor = [data[i - 4 + width], data[i - 3 + width], data[i - 2 + width], data[i - 1 + width]]
        }
        if (judgeEg(color, rightColor, leftColor, topColor, bottomColor)) {
            data[i] = data[i + 1] = data[i + 2] = 0;
            edgeArr.push(i);
        } else {
            data[i] = data[i + 1] = data[i + 2] = 255;
        }
    }

    return {
        edge: edgeArr,
        imageData: imageData,
        width: width
    }
}

function index2coordinate(index, width) {
    return {
        x: parseInt(index % width),
        y: parseInt(index / width)
    }
}

function coordinate2index(coordinate, width) {
    return coordinate.y*width + coordinate.x
}

function selectSpotFromDistance(arr, width) {
    let array = arr;
    let newArr = [];
    let coordinateArray = [];
    array.forEach((item) => {
        coordinateArray.push(index2coordinate(item, width))
    });

    function distance(obj1, obj2) {
        return (obj1.x - obj2.x)*(obj1.x - obj2.x) + (obj1.y - obj2.y)*(obj1.y - obj2.y)
    }

    while(coordinateArray.length > 1) {
        let min = 1/0;
        let index = 0;
        for (let i = 1; i < coordinateArray.length; i++) {
            if (distance(coordinateArray[0], coordinateArray[i]) < min) {
                min = distance(coordinateArray[0], coordinateArray[i]);
                index = i;
            }
        }
        newArr.push([coordinate2index(coordinateArray[0], width),
            coordinate2index(coordinateArray[index], width)]);
        coordinateArray.splice(index,1);
        coordinateArray.splice(0,1);
    }
    return newArr;
}

function lineToSpot(array, width) {
    let _array = [];
    array.forEach((arr) => {
        let spot1 = index2coordinate(arr[0], width);
        let spot2 = index2coordinate(arr[1], width);
        let _arr = [];
        if (spot1.x - spot2.x === 0) {
            for(let i = spot1.y; i <= spot2.y; i++) {
                _arr.push(coordinate2index({x: spot1.x, y: i}, width))
            }
        } else {
            let k = (spot1.y - spot2.y)/(spot1.x - spot2.x);
            let b = spot1.y - k*spot1.x;
            if (k > 0) {
                for(let i = spot1.x; i <= spot2.x; i++) {
                    if (!String(k*i + b).includes('.')) _arr.push(coordinate2index({x: i, y: k*i + b}, width))
                }
            } else {
                for(let i = spot1.x; i >= spot2.x; i--) {
                    if (!String(k*i + b).includes('.')) _arr.push(coordinate2index({x: i, y: k*i + b}, width))
                }
            }
        }
        _array.push(_arr)
    });
    return _array
}

function combo(edgeArr, width, data) {
    lineToSpot(selectSpotFromDistance(edgeArr, width), width).forEach((arr) => {
        arr.forEach((i) => {
            data[i] = data[i + 1] = data[i + 2] = 0;
        });
    });
}
