document.addEventListener('DOMContentLoaded', function() {
    const initPage2 = () => {
        const rowsInput = document.getElementById('matrix-rows');
        const colsInput = document.getElementById('matrix-cols');
        const generateBtn = document.getElementById('generate-btn');
        const originalMatrix = document.getElementById('original-matrix');
        const transposedSection = document.getElementById('transposed-section');
        const transposedMatrix = document.getElementById('transposed-matrix');
        const determinantSection = document.getElementById('determinant-section');
        const determinantValue = document.getElementById('determinant-value');
        const inverseSection = document.getElementById('inverse-section');
        const inverseMatrixElem = document.getElementById('inverse-matrix');
        const traceSection = document.getElementById('trace-section');
        const traceValue = document.getElementById('trace-value');

        let matrix = [];
        let rows = 0;
        let cols = 0;

        function updateMatrixValue(row, col, value) {
            if (matrix[row]) matrix[row][col] = parseFloat(value) || 0;
            autoCalculate();
        }

        function generateMatrix() {
            rows = parseInt(rowsInput.value) || 3;
            cols = parseInt(colsInput.value) || 3;
            matrix = [];
            originalMatrix.innerHTML = '';

            for (let i = 0; i < rows; i++) {
                matrix[i] = new Array(cols).fill(0);
                const rowDiv = document.createElement('div');
                rowDiv.className = 'matrix-row';
                
                for (let j = 0; j < cols; j++) {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.className = 'matrix-cell';
                    input.value = 0;
                    input.addEventListener('input', (e) => {
                        updateMatrixValue(i, j, e.target.value);
                    });
                    rowDiv.appendChild(input);
                }
                originalMatrix.appendChild(rowDiv);
            }
            autoCalculate();
        }

        function transposeMatrix() {
            const transposed = [];
            for (let j = 0; j < cols; j++) {
                transposed[j] = [];
                for (let i = 0; i < rows; i++) {
                    transposed[j][i] = matrix[i][j] || 0;
                }
            }
            return transposed;
        }

        function traceMatrix() {
            let trace = 0;
            const minSize = Math.min(rows, cols);
            for (let i = 0; i < minSize; i++) {
                trace += matrix[i][i] || 0
            };
            return trace;
        }

        function determinantRecursive(mat) {
            const size = mat.length;
            if (size === 1) return mat[0][0];
            if (size === 2) return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];

            let det = 0;
            for (let j = 0; j < size; j++) {
                const minor = [];
                for (let i = 1; i < size; i++) {
                    minor[i-1] = [];
                    for (let k = 0; k < size; k++) {
                        if (k !== j) minor[i-1].push(mat[i][k] || 0);
                    }
                }
                det += Math.pow(-1, j) * mat[0][j] * determinantRecursive(minor);
            }
            return det;
        }

        function inverseMatrix() {
            if (rows !== cols) return null;
            const det = determinantRecursive(matrix);
            if (det === 0 || isNaN(det)) return null;
            if (rows === 1) return [[1/(matrix[0][0] || 1)]];

            const size = rows;
            const adjugate = [];
            for (let i = 0; i < size; i++) {
                adjugate[i] = [];
                for (let j = 0; j < size; j++) {
                    const minor = [];
                    for (let r = 0; r < size; r++) {
                        if (r === i) continue;
                        const rowIndex = r > i ? r-1 : r;
                        minor[rowIndex] = [];
                        for (let c = 0; c < size; c++) {
                            if (c === j) continue;
                            minor[rowIndex].push(matrix[r][c] || 0);
                        }
                    }
                    adjugate[i][j] = Math.pow(-1, i+j) * determinantRecursive(minor);
                }
            }

            const inverse = [];
            for (let j = 0; j < size; j++) {
                inverse[j] = [];
                for (let i = 0; i < size; i++) {
                    inverse[j][i] = (adjugate[i][j] / det) || 0;
                }
            }
            return inverse;
        }

        function updateResult(elementId, value, isMatrix = false) {
            const container = document.getElementById(elementId);
            if (!container) return;
            
            container.innerHTML = '';
            if (isMatrix && Array.isArray(value)) {
                value.forEach(row => {
                    const rowDiv = document.createElement('div');
                    rowDiv.className = 'matrix-row';
                    row.forEach(cell => {
                        const cellDiv = document.createElement('div');
                        cellDiv.className = 'matrix-cell';
                        cellDiv.textContent = Number(cell).toFixed(2);
                        rowDiv.appendChild(cellDiv);
                    });
                    container.appendChild(rowDiv);
                });
            } else if (!isMatrix && !isNaN(value)) {
                container.textContent = Number(value).toFixed(2);
            }
        }

        function autoCalculate() {
            try {
                const transposed = transposeMatrix();
                updateResult('transposed-matrix', transposed, true);
                transposedSection.classList.remove('hidden');

                if (rows === cols) {
                    const det = determinantRecursive(matrix);
                    updateResult('determinant-value', det);
                    determinantSection.classList.remove('hidden');

                    const trace = traceMatrix();
                    updateResult('trace-value', trace);
                    traceSection.classList.remove('hidden');

                    const inv = inverseMatrix();
                    if (inv) {
                        updateResult('inverse-matrix', inv, true);
                        inverseSection.classList.remove('hidden');
                    } else inverseSection.classList.add('hidden');
                } else {
                    determinantSection.classList.add('hidden');
                    traceSection.classList.add('hidden');
                    inverseSection.classList.add('hidden');
                }
            } catch (e) {
                console.error('Error:', e);
            }
        }

        generateBtn.addEventListener('click', generateMatrix);
        generateMatrix();
    };

    initPage2();
});