function distanceBetweenPoints(_objAx,_objAy,_objBx,_objBy){
    return Math.sqrt( Math.pow(_objAx-_objBx,2) + Math.pow(_objAy-_objBy,2) );
}
function magnitudeOfVec(x,y){
    return Math.sqrt( Math.pow(x,2) + Math.pow(y,2) );
}
function angleBetweenPoints(_p1x,_p1y,_p2x,_p2y){
    return Math.atan2(_p2y-_p1y, _p2x-_p1x);
}

function normalizeVector(_x,_y){
    var len = Math.sqrt(_x * _x + _y * _y);
    var nx = _x/len;
    var ny = _y/len;
    return {x:nx,y:ny};
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}
function roundToX(num,dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec)
}

function randomString(length) {
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// http://stackoverflow.com/questions/22521982/js-check-if-point-inside-a-polygon
function pointInPolygon(point, vs){ // ([x,y], [[x1,y1],[x2,y2],[x3,y3]...])
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function getVertices(_obj,_data_type,_padding){ //_data_type can be "obj" or "arr", _padding is true/false

    var pad_x = 1.0;
    var pad_y = 1.0;
    if(_padding===true){ //if true, we should calculate with padding
        pad_x = _obj.padding_x;
        pad_y = _obj.padding_y;
    }

    //rectangle
    if(_obj.type==="rectangle"){

        var pointsR;

        if(_obj.rotation!==0){

           var BRx = _obj.x + ( (_obj.width*pad_x) / 2 ) * Math.cos(_obj.rotation) - ( (_obj.height*pad_y) / 2 ) * Math.sin(_obj.rotation);
           var BRy = _obj.y + ( (_obj.height*pad_y) / 2 ) * Math.cos(_obj.rotation)  + ( (_obj.width*pad_x) / 2 ) * Math.sin(_obj.rotation);
           var BLx = _obj.x - ( (_obj.width*pad_x) / 2 ) * Math.cos(_obj.rotation) - ( (_obj.height*pad_y) / 2 ) * Math.sin(_obj.rotation);
           var BLy = _obj.y + ( (_obj.height*pad_y) / 2 ) * Math.cos(_obj.rotation)  - ( (_obj.width*pad_x) / 2 ) * Math.sin(_obj.rotation);
           var TRx = _obj.x + ( (_obj.width*pad_x) / 2 ) * Math.cos(_obj.rotation) + ( (_obj.height*pad_y) / 2 ) * Math.sin(_obj.rotation);
           var TRy = _obj.y - ( (_obj.height*pad_y) / 2 ) * Math.cos(_obj.rotation)  + ( (_obj.width*pad_x) / 2 ) * Math.sin(_obj.rotation);
           var TLx = _obj.x - ( (_obj.width*pad_x) / 2 ) * Math.cos(_obj.rotation) + ( (_obj.height*pad_y) / 2 ) * Math.sin(_obj.rotation);
           var TLy = _obj.y - ( (_obj.height*pad_y) / 2 ) * Math.cos(_obj.rotation)  - ( (_obj.width*pad_x) / 2 ) * Math.sin(_obj.rotation);
            
            
            if(_data_type=="arr"){
                pointsR = [
                  [TLx, TLy], //upper left
                  [TRx, TRy], //upper right
                  [BRx, BRy], //bottom right
                  [BLx, BLy] //bottom left
                ];
            }
            if(_data_type=="obj"){
                pointsR = [
                  {x:TLx, y:TLy}, //upper left
                  {x:TRx, y:TRy}, //upper right
                  {x:BRx, y:BRy}, //bottom right
                  {x:BLx, y:BLy} //bottom left
                ];                
            }

        }else{

            if(_data_type=="arr"){
                pointsR = [
                  [_obj.x-((_obj.width*pad_x)/2), _obj.y-((_obj.height*pad_y)/2)], //upper left
                  [_obj.x+((_obj.width*pad_x)/2), _obj.y-((_obj.height*pad_y)/2)], //upper right
                  [_obj.x+((_obj.width*pad_x)/2), _obj.y+((_obj.height*pad_y)/2)], //bottom right
                  [_obj.x-((_obj.width*pad_x)/2), _obj.y+((_obj.height*pad_y)/2)] //bottom left
                ];
            }

            if(_data_type=="obj"){
                pointsR = [
                  {x:_obj.x-((_obj.width*pad_x)/2), y:_obj.y-((_obj.height*pad_y)/2)}, //upper left
                  {x:_obj.x+((_obj.width*pad_x)/2), y:_obj.y-((_obj.height*pad_y)/2)}, //upper right
                  {x:_obj.x+((_obj.width*pad_x)/2), y:_obj.y+((_obj.height*pad_y)/2)}, //bottom right
                  {x:_obj.x-((_obj.width*pad_x)/2), y:_obj.y+((_obj.height*pad_y)/2)} //bottom left
                ];
            }
            
        }

        return pointsR;

    }

    //circle
    if(_obj.type==="circle"){
        var pointsC = [];
        for(var i = 0; i < 8; i++) {
            var px = _obj.x + ((_obj.width*pad_x)/2) * Math.cos(2 * Math.PI * i / 8);
            var py = _obj.y + ((_obj.height*pad_x)/2) * Math.sin(2 * Math.PI * i / 8);   
            if(_data_type=="obj"){
                pointsC.push({x:px,y:py});  
            }
            if(_data_type=="arr"){
                pointsC.push([px,py]); 
            }
        }
        return pointsC;
    }

}


// function slope(x1, y1, x2, y2){
//     if (x1 == x2) return false;
//     return (y1 - y2) / (x1 - x2);
// }
// function yInt(x1, y1, x2, y2){
//     if (x1 === x2) return y1 === 0 ? 0 : false;
//     if (y1 === y2) return y1;
//     return y1 - this.slope(x1, y1, x2, y2) * x1 ;
// }
// function getXInt(x1, y1, x2, y2){
//     var slope;
//     if (y1 === y2) return x1 == 0 ? 0 : false;
//     if (x1 === x2) return x1;
//     return (-1 * ((slope = this.slope(x1, y1, x2, y2)) * x1 - y1)) / slope;
// }
// function lineIntersect2(x11, y11, x12, y12, x21, y21, x22, y22){
//     var slope1, slope2, yint1, yint2, intx, inty;
//     if (x11 == x21 && y11 == y21) return [x11, y11];
//     if (x12 == x22 && y12 == y22) return [x12, y22];

//     slope1 = this.slope(x11, y11, x12, y12);
//     slope2 = this.slope(x21, y21, x22, y22);
//     if (slope1 === slope2) return false;

//     yint1 = this.yInt(x11, y11, x12, y12);
//     yint2 = this.yInt(x21, y21, x22, y22);
//     if (yint1 === yint2) return yint1 === false ? false : [0, yint1];

//     if (slope1 === false) return [y21, slope2 * y21 + yint2];
//     if (slope2 === false) return [y11, slope1 * y11 + yint1];
//     intx = (slope1 * x11 + yint1 - yint2)/ slope2;
//     return [intx, slope1 * intx + yint1];
// }



function lineIntersect2(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        //return result;
        return false;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));

    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    if(result.onLine1 && result.onLine2){
        return {x:result.x, y:result.y};
    }else{
        return false;
    }
    //return result;
};



function lineIntersect(x1,y1,x2,y2, x3,y3,x4,y4) {
    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    if (isNaN(x)||isNaN(y)) {
        return false;
    } else {
        if (x1>=x2) {
            if (!(x2<=x&&x<=x1)) {return false;}
        } else {
            if (!(x1<=x&&x<=x2)) {return false;}
        }
        if (y1>=y2) {
            if (!(y2<=y&&y<=y1)) {return false;}
        } else {
            if (!(y1<=y&&y<=y2)) {return false;}
        }
        if (x3>=x4) {
            if (!(x4<=x&&x<=x3)) {return false;}
        } else {
            if (!(x3<=x&&x<=x4)) {return false;}
        }
        if (y3>=y4) {
            if (!(y4<=y&&y<=y3)) {return false;}
        } else {
            if (!(y3<=y&&y<=y4)) {return false;}
        }
    }
    return true;
}

function doPolygonsIntersect(a,b){
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (isUndefined(minA) || projected < minA) {
                    minA = projected;
                }
                if (isUndefined(maxA) || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (isUndefined(minB) || projected < minB) {
                    minB = projected;
                }
                if (isUndefined(maxB) || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {

                return false;
            }
        }
    }
    return true;
}

function isUndefined(variable){
	if (variable === undefined || variable === null) {
		return true;
	}else{
		return false;
	}
}

var isMobile = {
    Android: function() {return navigator.userAgent.match(/Android/i);},
    BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
    iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
    Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
    Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
    any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}
};