/// <reference path="gl-matrix.js" />
// B581-lab-6-starting-text.js
// CSCI B581 Advanced Computer Graphics
// Mitja Hmeljak - Fall 2014

var gl = null;
var modelViewInTheShader, projectionInTheShader;
var canvas = null;
var gModelViewMatrix = [
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
];
var clickedPointIndex = null;
var lastPtIndex = 0;
var PROXIMITY_DISTANCE = 0.01;
var lCanvas;
    var P = []; 
var normalsMatrix;  
var vertexTransformNormal;
var attributeVertexNormal;

var normalsArray = []; 
//Control Points Array will store an array of vec2 containing x and y coordinates. 
var controlPointsArray = [];
//Drawing points array will contain interpolated points to draw on the screen. 
var drawingPointsArray = [];
var gLabel;
var curveType = null;
//  TODO: you may want to use these globals to keep track of rotation & translation:
var dX = 0;
var dY = 0;
var dAngle = 0;
var sourcePoints = [.5, 0, 0, .5, .25, 0, .5, .5];


window.onload = function mainMini() {
    gLabel = document.getElementById("debug-label")
    gLabel.innerHTML = "testing for WebGL"

    if (!window.WebGLRenderingContext) {
        gLabel.innerHTML = "No WebGL Rendering Context available in your web browser:<br>" +
                "window.WebGLRenderingContext = {" + JSON.stringify(window.WebGLRenderingContext) + "}";
        return;
    } else {
        gLabel.innerHTML = "WebGL Rendering Context found:<br>" +
                "window.WebGLRenderingContext = {" + JSON.stringify(window.WebGLRenderingContext) + "}";
    }

    lCanvas = document.getElementById("gl-canvas-ss");

    var lWebGLnames = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    for (var ii = 0; ii < lWebGLnames.length; ++ii) {
        gLabel.innerHTML = "Querying for {" + lWebGLnames[ii] + "} context."

        try {
            gl = lCanvas.getContext(lWebGLnames[ii]);
        } catch (e) {
            alert("Error creating WebGL Context: " + e.toString());
            return;
        }
        if (gl) {
            break;
        }
    }
    if (!gl) {
        alert("Unable to create WebGL Context.")
        return;
    }

    gLabel.innerHTML = "Obtained WebGL context."


    var lTriangleVertices = [
        -1, -1,
        0, 1,
        1, -1
    ];
    //Fill normal array with 1.0 ; 


    gLabel.innerHTML = "This is a WebGL-rendered triangle."


    
    DrawEverything();

};


function DrawEverything(){
    var lGLSLprogram = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(lGLSLprogram);
    gl.enable(gl.DEPTH_TEST);

    var vPosition = gl.getAttribLocation(lGLSLprogram, "aVPosition");
    attributeVertexNormal = gl.getAttribLocation(lGLSLprogram, "aVertexNormal");

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
var M; 
    //Pass the type of curve here. 
    if ( curveType == 'bz'){
       M6  = math.matrix([
                    [1,0,0, 0],
                    [-3,3,0,0],
                    [3,-6,3,0],
                    [-1,3,-3,1]
                ]);

         M = M6
    }
    else{
        var M6 = math.matrix([
                    [1,4,1, 0],
                    [-3,0,3,0],
                    [3,-6,3,0],
                    [-1,3,-3,1]
                ]);
       var n = 1/6.0;
    M = (math.multiply(M6, n));
    }
    var pts = DrawSurface(M);
    //console.log(pts);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pts), gl.STATIC_DRAW);
    bufferId.numItems = pts.length;
    bufferId.itemSize = 3;
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    //Randomly create normals array
    // for ( i = 0 ; i < pts.length ; i++){
    //     normalsArray.push(Math.random()); 
    // }

 
    /*For Lighting
    var normalsMatrix;  
    var vertexTransformNormal;
    var attributeVertexNormal;
    */
      //Create a buffer for storing normals 
    var normalsBuffer = []; 
    var bufferIdNormals = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdNormals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalsArray), gl.STATIC_DRAW);
    bufferId.numItems = pts.length/3;
    bufferId.itemSize = 3;
    gl.vertexAttribPointer(attributeVertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributeVertexNormal);

   // normalsMatrix = gl.getUniformLocation(lGLSLprogram,"uNMatrix");   
    modelViewInTheShader = gl.getUniformLocation(lGLSLprogram, "modelViewMatrix");
    projectionInTheShader = gl.getUniformLocation(lGLSLprogram, "projectionMatrix");
   
    //Draw the control points 
    var rm = mat4.create();
    var scalevec3 = vec3.create(); 
    scalevec3[0] =2; 
    scalevec3[1] =2.25 ; 
    scalevec3[2] = 1.5;
   //  mat4.scale(rm, rm , scalevec3);

     var tvec = vec3.create(); 
     tvec[0] = -.2; 
    //mat4.translate(rm, rm, tvec);
    //mat4.rotateY(rm,rm , (math.pi/4));
    // mat4.translate(rm, rm, [-.2,0,.3] );
    //mat4.rotateX(rm,rm , (-math.pi/2)) ;    
    //mat4.rotateZ(rm,rm , (-math.pi/6));

     //console.log(gModelViewMatrix);
    gl.uniformMatrix4fv(modelViewInTheShader, false, new Float32Array(rm));
    
     //var m = []; 
     //var rad = 30* (math.pi)/180; 
    //mat4.perspective(m,rad, 1, 100, pm );
    //console.log(m); 
     gl.uniformMatrix4fv(projectionInTheShader, false, new Float32Array(myOrtho2D(-1, 1, -1, 1)));
     
     //Create and set the normals matrix 
     var nmatrix = mat3.create();
  
     //gl.uniformMatrix3fv(normalsMatrix, false, nmatrix);


    gl.enable(gl.DEPTH_TEST);

     var projectionMatrix =
        makePerspective(2.5, 2, 1, 100);
        console.log(projectionMatrix);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        //console.log(projectionMatrix);
    //gl.uniformMatrix4fv(projectionInTheShader, false, new Float32Array((projectionMatrix)));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, pts.length/3);

}

function GetRawControlPointsArray() {
    var returnArray = [];
    for (i = 0; i < controlPointsArray.length; i++) {
        var item = controlPointsArray[i];
        returnArray.push(item[0]);
        returnArray.push(item[1]);
    }
    return returnArray;
}


function myOrtho2D(left, right, bottom, top, p1, p2) {

    //top = near. tan(pi *FOV / 360); 
    p1 = -1 ; 
    p2 = 1 
    var near = p1;
    //top = near * math.tan(math.pi * (45)/360); 
    //console.log(top);
    var far = p2;
    var rl = right - left;
    var tb = top - bottom;
    var fn = far - near;

    var cota2 = 1/math.tan(math.unit(30, 'deg'));
    // the returned matrix is defined "transposed", i.e. the last row
    //   is really the last column as used in matrix multiplication:
    return [2 / rl, 0, 0, 0,
        0, 2 / tb, 0, 0,
        0, 0, 2 / fn, 0,
        -(right + left) / rl, -(top + bottom) / tb, -(far + near) / fn, 1];

}

// ------------------------------------------------------------
function initShaders(gl, vertexShaderId, fragmentShaderId) {
    var vertShdr;
    var fragShdr;

    var vertElem = document.getElementById(vertexShaderId);
    if (!vertElem) {
        alert("Unable to load vertex shader " + vertexShaderId);
        return -1;
    }
    else {
        vertShdr = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShdr, vertElem.text);
        gl.compileShader(vertShdr);
        if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
            var msg = "Vertex shader failed to compile.  The error log is:"
                    + "<pre>" + gl.getShaderInfoLog(vertShdr) + "</pre>";
            alert(msg);
            return -1;
        }
    }

    var fragElem = document.getElementById(fragmentShaderId);
    if (!fragElem) {
        alert("Unable to load vertex shader " + fragmentShaderId);
        return -1;
    }
    else {
        fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShdr, fragElem.text);
        gl.compileShader(fragShdr);
        if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
            var msg = "Fragment shader failed to compile.  The error log is:"
                    + "<pre>" + gl.getShaderInfoLog(fragShdr) + "</pre>";
            alert(msg);
            return -1;
        }
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertShdr);
    gl.attachShader(program, fragShdr);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var msg = "Shader program failed to link.  The error log is:"
                + "<pre>" + gl.getProgramInfoLog(program) + "</pre>";
        alert(msg);
        return -1;
    }

    return program;
}


function GetIncrementValue(axis) {
    //Get the amount to increament based on the number of pixels in the canvas 
    var canvasHeight = canvas.height();

}

function GetCanvasCoordinateX(inputX) {
    //Get the center of the screen 
    var pointCoordinates = 2.0 * inputX / canvas.width();
    var final = pointCoordinates - 1.0;
    return final;
}
function GetCanvasCoordinateY(inputY) {
    //Get the center of the screen 
    var pointCoordinates = 2.0 * inputY / canvas.height();
    var final = 1.0 - pointCoordinates;
    return final;
}
$(document).ready(function() {
    canvas = $('#gl-canvas-ss');
    
$('#ddlCurveType').change(function() {
        curveType = $(this).val();
        DrawEverything(); 
    });
     curveType = $('#ddlCurveType').find('option:selected').val();

     $('#btnClearSpline').click(function(){
         Reset();
   $('#ddlCurveType').val('bz');
     });
});

function Reset(){
       var lGLSLprogram = initShaders(gl, "vertex-shader", "fragment-shader");
                  controlPointsArray = [];
            drawingPointsArray = [];
            clickedPointIndex = null;
            lastPtIndex = 0;

        gl.useProgram(lGLSLprogram);
  var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation(lGLSLprogram, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewInTheShader = gl.getUniformLocation(lGLSLprogram, "modelViewMatrix");
    projectionInTheShader = gl.getUniformLocation(lGLSLprogram, "projectionMatrix");

    //Draw the control points 
    gl.uniformMatrix4fv(modelViewInTheShader, false, new Float32Array(gModelViewMatrix));
    gl.uniformMatrix4fv(projectionInTheShader, false, new Float32Array(myOrtho2D(-1, 1, -1, 1)));
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.

         gl.drawArrays(gl.POINTS, 0, 0);
         
            
}

function TestForProximity(pointVec, callback) {


    for (j = 0; j < controlPointsArray.length; j++) {
        var d = vec2.distance(pointVec, controlPointsArray[j]);
        if (d <= PROXIMITY_DISTANCE) {

            clickedPointIndex = j;
            var point = controlPointsArray[j];
            clickedPointIndex = j;
            if (callback !== undefined) {
                //console.log("Calling callback.");
                callback();
                return;
            }
            else {
                return true;
            }


        }

    }
    //console.log("J value" + j);
    if (j === controlPointsArray.length - 1) {
        if (callback !== undefined) {
            callback();

        }
        else {
            return true;
        }
    }

}

function GetControlPointsArray(axis, startIndex) {
    var pointsArray = [];
   

    //Since we have to join the last point (i -1) th point with the ith ponit, we will have to 
    //interpolate the middle values to get a continuous curve. 
    if (controlPointsArray.length >= 4) {
        //Control point 1 will be the last element. 

        //point p0

        for (i = startIndex; i < startIndex + 4; i++) {
            if (i < controlPointsArray.length) {
                if (axis === 'x') {
                    var item = controlPointsArray[i];
                    pointsArray.push(item[0]);
                }
                else if (axis === 'y') {
                    var item = controlPointsArray[i];
                    pointsArray.push(item[1]);
                }
            }
        }


    }



    return pointsArray;
}


function GetCatmullRomCurve() {

    var s = 0.5; //tension for catmull rom splines 
    drawingPointsArray = [];
    
    for (k = 0; k < controlPointsArray.length - 3; k++) {
        var cpX = GetControlPointsArray('x',k);
            t = 0;
    inc = 0.01;
        
        var cpY = GetControlPointsArray('y',k);
      
        for (i = 0; i < 100; i++) {
            var bm = vec4.create();
            bm[0] = (-1 * s * t) + (2 * s * t * t) - (s * t * t * t);
            bm[1] = 1 + ((s - 3) * t * t) + ((2 - s) * t * t * t);
            bm[2] = (s * t) + ((3 - 2 * s) * t * t) + ((s - 2) * t * t * t);
            bm[3] = (-1 * s * t * t) + (s * t * t * t);
            var pointVec = vec2.create();

            pointVec[0] = vec4.dot(bm, cpX);
            pointVec[1] = vec4.dot(bm, cpY);

            drawingPointsArray.push(pointVec[0]);
            drawingPointsArray.push(pointVec[1]);
            //For y coordinates
            t = t + inc;
        }
    }


    return drawingPointsArray;


}

function GeBSplineCurve() {

    
    drawingPointsArray = [];
    
    for (k = 0; k < controlPointsArray.length - 3; k++) {
        var cpX = GetControlPointsArray('x',k);
            t = 0;
    inc = 0.01;
        
        var cpY = GetControlPointsArray('y',k);
      
        for (i = 0; i < 100; i++) {
            var bm = vec4.create();
            bm[0] = Math.pow((1 - t),3)/6.0;
            bm[1] = (4 - (6 * t * t) + (3*t*t*t))/6.0; 
            bm[2] = ( 1+ (3 * t ) + (3 * t * t)  - (3 * t * t * t) )/6.0;
            bm[3] = (t* t * t)/6.0; 
            var pointVec = vec2.create();

            pointVec[0] = vec4.dot(bm, cpX);
            pointVec[1] = vec4.dot(bm, cpY);

            drawingPointsArray.push(pointVec[0]);
            drawingPointsArray.push(pointVec[1]);
            //For y coordinates
            t = t + inc;
        }
    }


    return drawingPointsArray;


}


function GetIntersectionPoint() {
    //To achieve continuity of lines, 
}


function GetPValueForAxis(axis){
    var axisArray = [];
    for (  i = 0 ; i < 4 ; i++){
        var p = []; 
        for (  j = 0 ; j < 4 ; j++){
            
           if ( axis == 'x'){
            var point = math.subset(P,math.index(i, j,0)); 
            
            //p.push(point[0]);
            p.push(point);   
        }
        else if ( axis === 'y'){
               var point = math.subset(P,math.index(i, j,1)); 
            
            //p.push(point[0]);
            p.push(point);   
        }
        else if ( axis ==='z'){
            var point = math.subset(P,math.index(i, j,2)); 
            
            //p.push(point[0]);
            p.push(point);   
        }
    
       
        }
         axisArray.push(p); 
       
    }
  var r1 =axisArray[0];
        var r2 =axisArray[1];
        var r3 =axisArray[2];
        var r4 =axisArray[3];

 var a = math.matrix([r1,r2,r3,r4]); 
       //console.log(a); 
        return a ;
   
}
var fpx = [], fpy = []; fpz = []; 
var nx = new Array(), ny = new Array(), nz = new Array() ; 

function DrawSurface(M){
    //The general equation for points is p(u, v) = u' * M * P * M' * v 
    //u , v - column matrices 
    //M - Interpolation matrix. 
    //P - Matrix for 16 Points 

    //Generate the matrix for the given axis.
    P= [];
    P.push([-1,.9,.8]);
    P.push([-1,-.7,.3]);
    P.push([-1,-.6,-.2]);
    P.push([-1,.7,-.8]);
    p1 = P ;
    //console.log(p1);
    P = [];      
    P.push([-1,.7,-.8]);
    P.push([-.3,.7,-.8]);
    P.push([.2,.7,-.8]);
    P.push([1,.7,-.8]);
    p2 = P ; 
    //console.log(p2);
        P = [];  
     P.push([1,.7,-.8]);
    P.push([1,-.7,-0.2]);
    P.push([1,-.6,.3]);
    P.push([1,.9,.8]);
    p3 = P ; 
    P = [];  
    P.push([1,.9,.8]);
    P.push([.2,.9,.8]);
    P.push([-.3,.9,.8]);
    P.push([-1,.9,.8]);
p4 = P ; 
    P = [];  
 


    //console.log("Logging original Array : P ");
     a = math.matrix([p1,p2,p3,p4]);
     //console.log(a); 
     
     P = a ; 
    //Now to generate the surface , we need to interpolate and multiply all values for 
    //u and v to get the points p00, p01,...p33

    //Iterate through u and v to get point values
    //For each m value calculte n values of v
    //
    //Get these values for all x, y and z axis
    //console.log("getting separate points for x, y, z axis");  

    fpx = GetPointsForAxis('x', fpx, nx, M);

    //console.log(fpx); 
    fpy = GetPointsForAxis('y', fpy, ny,M);

    //console.log(fpy); 
    fpz = GetPointsForAxis('z', fpz, nz,M);
   //console.log(fpz); 
    //Merge these control points to get x,y, z values together. 
    //console.log(fpx);

    //Now nx, ny, nz contain u, v for x, y , z for all the points on 
    //the surface. 
    console.log("Length of nx is " + nx.length); 

    var normalVectorArray = []; 
    for ( i= 0 ; i < nx.length ; i = i+2){
       uelement = vec3.create(); 
       velement = vec3.create(); 
       var result = vec3.create(); 
        //1st param - u 
        uelement[0] = nx[i]; 
        velement[0] = nx[i+1];

        uelement[1] = ny[i]; 
        velement[1]  = ny[i+1 ]; 

        uelement[2] = nz[i]; 
        velement[2]  = nz[i+1]; 

        //u  --- ux, uy , uz 
        //v --- vx, vy , vz

        //Normalize u and v 
        vec3.normalize(uelement, uelement); 
        vec3.normalize(velement, velement);

        //Compute Cross Product 
          vec3.cross(result, uelement, velement);
          normalVectorArray.push(result); 



    }

    for ( k = 0 ; k < normalVectorArray.length ; k++){ 
        normalsArray.push((normalVectorArray[k])[0]);
        normalsArray.push((normalVectorArray[k])[1]);
        normalsArray.push((normalVectorArray[k])[2]);
    }
    
    var fPoints = []; 
    fpx.forEach(function (value, index, matrix) {
        fPoints.push(value); 
        fPoints.push(math.subset(fpy, math.index(index)));
         fPoints.push(math.subset(fpz, math.index(index)));
    });
    return fPoints;
} 

function GetPointsForAxis(axis, a, narray, M){
    a = []; 

    interval = 1/20 ; 
         for (  m = 0 ; m < 1 ; m += interval){
            v = m ; 
        for (  r = 0 ; r< 1; r += interval){
          u = r ; 
        var U= math.matrix([[1] , [u], [u*u], [u*u*u] ]); 
        var Ut = math.transpose(U);
        var V = math.matrix([[1], [v], [v*v] , [v*v*v]]); 
        var dv = math.matrix([[0], [1], [2*v], [3* v* v ]]);

        var du = math.matrix([[0] , [1], [2 * u], [3 * u* u]]); 
        var dUt = math.transpose(du); 



        var Mt = math.transpose(M); 

        im1  = math.multiply(Ut , M); 
        
        un1 = math.multiply(dUt, M); 
        console.log(un1); 

        //console.log("Getting x values ");
        var Px = GetPValueForAxis(axis);
      
        //console.log("Get the P matrix for multiplying axis " + axis);
        //console.log(Px); 
        im2 = math.multiply(Px,Mt);

        vn1 = math.multiply(im2  , dv); 



        nv = math.multiply(im1, vn1);  
        im2 = math.multiply(im2, V);
        //cross product nv,  uvar to get the nromal to the point. 

        uvar = math.multiply(un1, im2); 
        //tangenet plane u,v vectors for an axis. 
        narray.push(uvar); 
        narray.push(nv); 

        //Now multiply im1 and im2
        var finalPt = math.multiply(im1, im2);
        //console.log(axis + " Point " + finalPt);
        a.push(finalPt);
        }
    }



    
    return a ; 
}

function makePerspective(fieldOfViewInRadians, aspect, near, far) {
  var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  var rangeInv = 1.0 / (near - far);

  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ];
}


function cross( u, v )
{
    if ( !Array.isArray(u) || u.length < 3 ) {
        throw "cross(): first argument is not a vector of at least 3";
    }

    if ( !Array.isArray(v) || v.length < 3 ) {
        throw "cross(): second argument is not a vector of at least 3";
    }

    var result = [ 
        u[1]*v[2] - u[2]*v[1],
        u[2]*v[0] - u[0]*v[2],
        u[0]*v[1] - u[1]*v[0]
    ];

    return result;
}