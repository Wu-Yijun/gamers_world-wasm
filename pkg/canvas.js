
// Vertex shader program
const vsSource = `
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexColor;
    varying lowp vec3 vColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
        vColor = aVertexColor;
    }
`;

// Fragment shader program
const fsSource = `
varying lowp vec3 vColor;

void main(void) {
    gl_FragColor = vec4(vColor, 1.0);
}
`;


const data = {
    gl: null,
    programInfo: {
        program: null,
        attribLocations: {
            vertexPosition: null,
            vertexColor: null,
        },
        uniformLocations: {
            projectionMatrix: null,
            modelViewMatrix: null,
        }
    },
    vertexCount: 0,
    type: 0,
    offset: 0,
    trans: {
        x: 0,
        y: 0,
        fov: 75.0,
        distance: 10,
    }
}



// Initialize a shader program
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // Check if it linked correctly
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Creates a shader of the given type, uploads the source and compiles it.
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}


function upadteView() {
    const gl = data.gl;

    // Create a perspective matrix, a special matrix that is used to simulate the distortion of perspective in a camera.
    const fieldOfView = data.trans.fov * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 1000.0;
    const projectionMatrix = glMatrix.mat4.create();

    // Note: glmatrix.js always has the first argument as the destination to receive the result.
    glMatrix.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    // Set the drawing position to the identity point, which is the center of the scene.
    const modelViewMatrix = glMatrix.mat4.create();

    // Move the drawing position to where we want to start drawing the square.
    // glMatrix.mat4.lookAt(modelViewMatrix, [0, -2, 3], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.lookAt(modelViewMatrix, [0, -2 * data.trans.distance, 3 * data.trans.distance], [0, 0, 0], [0, 1, 0]);
    // console.log(modelViewMatrix);
    glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [data.trans.x, data.trans.y, 0.0]);
    // console.log(modelViewMatrix);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        data.programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        data.programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

}

// window.onload = main;

export function windowSizeChangeCallback() {
    if (data.gl) {
        data.gl.viewport(0, 0, data.gl.canvas.width, data.gl.canvas.height);
        upadteView();
    }
}

export function main(gl) {
    // If we don't have a GL context, give up now
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    data.gl = gl;
    // Initialize the shader program
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Collect all the info needed to use the shader program.
    data.programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    // Define the positions and colors for the vertices
    const positionsColors = new Float32Array([
        // x, y, z, r, g, b
        0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        0.2, 0.0, 0.0, 0.0, 1.0, 0.0,
        0.0, 0.2, 0.0, 0.0, 0.0, 1.0,
        0.2, 0.2, 0.0, 1.0, 1.0, 0.0,
        0.4, 0.0, 0.0, 0.0, 1.0, 1.0,
        0.4, 0.2, 0.0, 1.0, 0.0, 1.0,
        0.0, 0.4, 0.0, 1.0, 1.0, 1.0,
        0.2, 0.4, 0.0, 0.5, 0.5, 0.5,
        0.4, 0.4, 0.0, 0.0, 0.0, 0.0,
    ]);

    // Define the indices for the triangle strip
    const indices = new Uint32Array([
        // 0, 1, 2,
        // 1, 2, 3,
        // 1, 3, 4,
        // 3, 4, 5,
        // 2, 3, 6,
        // 3, 6, 7,
        // 3, 7, 5,
        // 5, 7, 8,
        0, 1, 3,
        1, 2, 4,
        4, 6, 7
    ]);
    updateVertex(positionsColors);
    updateIndex(indices);

    // Tell WebGL to use our program when drawing
    data.gl.useProgram(data.programInfo.program);

    // window resize call back
    windowSizeChangeCallback();

    upadteView();
}

export function draw() {
    data.gl.clearColor(0.5, 0.5, 0.5, 1.0);  // Clear to black, fully opaque
    data.gl.clearDepth(1.0);                 // Clear everything
    data.gl.enable(data.gl.DEPTH_TEST);           // Enable depth testing
    data.gl.depthFunc(data.gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    data.gl.clear(data.gl.COLOR_BUFFER_BIT | data.gl.DEPTH_BUFFER_BIT);

    data.gl.drawElements(data.gl.TRIANGLES, data.vertexCount, data.gl.UNSIGNED_INT, data.offset);
}

export function setTransform(x, y, z, scale) {
    data.trans.x = x * 0.1 || 0;
    data.trans.y = y * 0.1 || 0;
    data.trans.z = z * 0.1 || 0;
    data.trans.distance = scale * 10;
    console.log(data.trans);

    upadteView()
}

export function updateVertex(positionsColors) {
    const gl = data.gl;
    const programInfo = data.programInfo;

    // Create a buffer for the positions and colors
    const positionColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionsColors, gl.DYNAMIC_DRAW);

    // Tell WebGL how to pull out the positions from the positionColor buffer into the vertexPosition attribute.
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 24;  // 6 * 4 bytes per vertex
        const offset = 0;
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL how to pull out the colors from the positionColor buffer into the vertexColor attribute.
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 24;  // 6 * 4 bytes per vertex
        const offset = 12;  // 3 * 4 bytes to start of color data
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }

    data.offset = 0;
}


export function updateIndex(indices) {
    const gl = data.gl;
    // Create a buffer for the indices
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW);

    data.vertexCount = indices.length;
}