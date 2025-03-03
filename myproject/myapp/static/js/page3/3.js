document.addEventListener('DOMContentLoaded', function() {
    const rowsInput = document.getElementById('matrix-a-rows');
    const colsInput = document.getElementById('matrix-a-cols');
    const matrixDiv = document.getElementById('matrix-a');
    const vectorDiv = document.getElementById('vector-b');
    const resultDiv = document.getElementById('result-vector');
    const visualDiv = document.getElementById('3d-container');

    let scene, camera, renderer;
    let matrix = [];
    let vector = [];
    let mouseDown = false;
    let lastX = 0;
    let lastY = 0;
    let camRadius = 15;
    let camAngleX = 0.8;
    let camAngleY = 0.5;

    function createMatrix(rows, cols, container) {
        container.innerHTML = '';
        matrix = [];
        for(let i = 0; i < rows; i++) {
            matrix[i] = [];
            let row = document.createElement('div');
            row.className = 'matrix-row';
            for(let j = 0; j < cols; j++) {
                let input = document.createElement('input');
                input.type = 'number';
                input.className = 'matrix-cell';
                input.value = 0;
                input.oninput = function() {
                    matrix[i][j] = Number(this.value) || 0;
                    calculateResult();
                };
                row.appendChild(input);
                matrix[i][j] = 0;
            }
            container.appendChild(row);
        }
    }

    function createVector(size, container) {
        container.innerHTML = '';
        vector = [];
        let row = document.createElement('div');
        row.className = 'matrix-row';
        for(let i = 0; i < size; i++) {
            let input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-cell';
            input.value = 0;
            input.oninput = function() {
                vector[i] = Number(this.value) || 0;
                calculateResult();
            };
            row.appendChild(input);
            vector[i] = 0;
        }
        container.appendChild(row);
    }

    function multiplyMatrixVector() {
        let result = [];
        let rows = matrix.length;
        let cols = matrix[0].length;
        for(let i = 0; i < rows; i++) {
            result[i] = 0;
            for(let j = 0; j < cols; j++) {
                result[i] += matrix[i][j] * vector[j];
            }
        }
        return result;
    }

    function showResult(result) {
        resultDiv.innerHTML = '';
        for(let i = 0; i < result.length; i++) {
            let row = document.createElement('div');
            row.className = 'matrix-row';
            row.innerHTML = '<div class="matrix-cell">' + result[i].toFixed(2) + '</div>';
            resultDiv.appendChild(row);
        }
    }

    function setup3D() {
        if (!renderer) {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, 400/400, 0.1, 1000);
            renderer = new THREE.WebGLRenderer();
            renderer.setSize(400, 400);
            visualDiv.appendChild(renderer.domElement);
            
            visualDiv.onmousedown = function(e) {
                if(e.button === 0) {
                    mouseDown = true;
                    lastX = e.clientX;
                    lastY = e.clientY;
                }
            };
            
            visualDiv.onmouseup = function() {
                mouseDown = false;
            };
            
            visualDiv.onmousemove = function(e) {
                if(mouseDown) {
                    let dx = e.clientX - lastX;
                    let dy = e.clientY - lastY;
                    camAngleX -= dx * 0.01;
                    camAngleY += dy * 0.01;
                    lastX = e.clientX;
                    lastY = e.clientY;
                    
                    camera.position.x = camRadius * Math.sin(camAngleX) * Math.cos(camAngleY);
                    camera.position.y = camRadius * Math.sin(camAngleY);
                    camera.position.z = camRadius * Math.cos(camAngleX) * Math.cos(camAngleY);
                    camera.lookAt(0, 0, 0);
                }
            };

            visualDiv.onwheel = function(e) {
                camRadius += e.deltaY * 0.0125;
                camRadius = Math.max(5, Math.min(50, camRadius));
                camera.position.x = camRadius * Math.sin(camAngleX) * Math.cos(camAngleY);
                camera.position.y = camRadius * Math.sin(camAngleY);
                camera.position.z = camRadius * Math.cos(camAngleX) * Math.cos(camAngleY);
                camera.lookAt(0, 0, 0);
                e.preventDefault();
            };

            scene.add(new THREE.GridHelper(20, 20));
            scene.add(new THREE.AxesHelper(10));
            
            camera.position.x = camRadius * Math.sin(camAngleX) * Math.cos(camAngleY);
            camera.position.y = camRadius * Math.sin(camAngleY);
            camera.position.z = camRadius * Math.cos(camAngleX) * Math.cos(camAngleY);
            camera.lookAt(0, 0, 0);
            
            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            animate();
        }
    }

    function drawArrows(oldVec, newVec) {
        while(scene.children.length > 2) {
            scene.remove(scene.children[2]);
        }

        let oldArrow = new THREE.ArrowHelper(
            new THREE.Vector3(...oldVec).normalize(),
            new THREE.Vector3(0, 0, 0),
            Math.hypot(...oldVec),
            0x0000ff
        );
        scene.add(oldArrow);

        let newArrow = new THREE.ArrowHelper(
            new THREE.Vector3(...newVec).normalize(),
            new THREE.Vector3(0, 0, 0),
            Math.hypot(...newVec),
            0xff0000
        );
        scene.add(newArrow);
    }

    function calculateResult() {
        let result = multiplyMatrixVector();
        showResult(result);
        
        let vecLen = vector.length;
        let resLen = result.length;
        let sameSize = vecLen === resLen;
        let validSize = vecLen >= 1 && vecLen <= 3;
        
        if (!validSize || !sameSize) {
            visualDiv.style.display = 'none';
            return;
        }
        
        let old3D = vector.slice();
        let new3D = result.slice();
        
        while(old3D.length < 3) old3D.push(0);
        while(new3D.length < 3) new3D.push(0);
        
        setup3D();
        drawArrows(old3D, new3D);
        visualDiv.style.display = 'block';
    }

    rowsInput.oninput = function() {
        createMatrix(Number(this.value), Number(colsInput.value), matrixDiv);
        calculateResult();
    };

    colsInput.oninput = function() {
        createMatrix(Number(rowsInput.value), Number(this.value), matrixDiv);
        createVector(Number(this.value), vectorDiv);
        calculateResult();
    };

    createMatrix(2, 2, matrixDiv);
    createVector(2, vectorDiv);
    calculateResult();
});