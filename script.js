document.addEventListener('DOMContentLoaded', function() {
    const operationSelect = document.getElementById('operationSelect');
    const doOperation = document.getElementById('doOperation');
    const a1Input = document.getElementById('a1');
    const b1Input = document.getElementById('b1');
    const a2Input = document.getElementById('a2');
    const b2Input = document.getElementById('b2');
    const container1 = document.getElementById('Matrix1');
    const container2 = document.getElementById('Matrix2');
    const resultContainer = document.getElementById('resultMatrix');
    const determinant1 = document.getElementById('determinant1');
    const determinant2 = document.getElementById('determinant2');

    function updateConstraints() {
        const operation = operationSelect.value;
        if (operation === 'Add' || operation === 'Subtract') {
            a2Input.value = a1Input.value;
            b2Input.value = b1Input.value;
        } else if (operation === 'Multiply') {
            b1Input.value = a2Input.value;
        }
        generateFields();
        toggleInputFields(operation);
    }

    function toggleInputFields(operation) {
        if (operation === 'Add' || operation === 'Subtract') {
            a2Input.disabled = true;
            b2Input.disabled = true;
            a1Input.disabled = false;
            b1Input.disabled = false;
        } else if (operation === 'Multiply') {
            a2Input.disabled = false;
            b2Input.disabled = false;
            a1Input.disabled = false;
            b1Input.disabled = true;
        }
    }

    function generateFields() {
        const numberOfa1 = parseInt(a1Input.value);
        const numberOfb1 = parseInt(b1Input.value);
        const numberOfa2 = parseInt(a2Input.value);
        const numberOfb2 = parseInt(b2Input.value);

        container1.innerHTML = '';
        container2.innerHTML = '';

        for (let j = 0; j < numberOfa1; j++) {
            const line = document.createElement('div');
            for (let i = 0; i < numberOfb1; i++) {
                const inputField = document.createElement('input');
                inputField.type = 'number';
                inputField.className = 'inputField';
                inputField.placeholder = `${j}; ${i}`;
                line.appendChild(inputField);
            }
            container1.appendChild(line);
        }

        for (let j = 0; j < numberOfa2; j++) {
            const line = document.createElement('div');
            for (let i = 0; i < numberOfb2; i++) {
                const inputField = document.createElement('input');
                inputField.type = 'number';
                inputField.className = 'inputField';
                inputField.placeholder = `${j}; ${i}`;
                line.appendChild(inputField);
            }
            container2.appendChild(line);
        }
        displayMatrixDeterminant();
    }

    operationSelect.addEventListener('change', updateConstraints);
    a1Input.addEventListener('input', updateConstraints);
    b1Input.addEventListener('input', updateConstraints);
    a2Input.addEventListener('input', updateConstraints);
    b2Input.addEventListener('input', updateConstraints);

    function extractMatrixValues(container) {
        const matrix = [];
        const rows = container.querySelectorAll('div');
        rows.forEach(row => {
            const rowValues = [];
            const inputs = row.querySelectorAll('input');
            inputs.forEach(input => {
                const value = parseFloat(input.value);
                if (isNaN(value)) {
                    rowValues.push(0);
                } else {
                    rowValues.push(value);
                }
            });
            matrix.push(rowValues);
        });
        return matrix;
    }

    function Add() {
        const matrix1 = extractMatrixValues(container1);
        const matrix2 = extractMatrixValues(container2);
        let matrix3 = [];

        for (let i = 0; i < matrix1.length; i++) {
            matrix3[i] = [];
            for (let j = 0; j < matrix1[i].length; j++) {
                matrix3[i][j] = (matrix1[i][j] + matrix2[i][j]);
            }
        }
        return matrix3;
    }

    function Subtract() {
        const matrix1 = extractMatrixValues(container1);
        const matrix2 = extractMatrixValues(container2);
        let matrix3 = [];

        for (let i = 0; i < matrix1.length; i++) {
            matrix3[i] = [];
            for (let j = 0; j < matrix1[i].length; j++) {
                matrix3[i][j] = (matrix1[i][j] - matrix2[i][j]);
            }
        }
        return matrix3;
    }

    function Multiply() {
        const matrix1 = extractMatrixValues(container1);
        const matrix2 = extractMatrixValues(container2);
        let matrix3 = [];

        for (let i = 0; i < matrix1.length; i++) {
            matrix3[i] = [];
            for (let j = 0; j < matrix2[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < matrix1[0].length; k++) {
                    sum += matrix1[i][k] * matrix2[k][j];
                }
                matrix3[i][j] = sum;
            }
        }
        return matrix3;
    }

    function displayResultMatrix(matrix) {
        resultContainer.innerHTML = '';
        resultContainer.style.display = 'block';

        for (let i = 0; i < matrix.length; i++) {
            const line = document.createElement('div');
            for (let j = 0; j < matrix[i].length; j++) {
                const inputField = document.createElement('input');
                inputField.type = 'number';
                inputField.className = 'inputField';
                inputField.value = matrix[i][j];
                inputField.readOnly = true;
                line.appendChild(inputField);
            }
            resultContainer.appendChild(line);
        }
    }

    doOperation.addEventListener('click', function() {
        let resultMatrix;
        switch (operationSelect.value) {
            case 'Add':
                resultMatrix = Add();
                break;
            case 'Subtract':
                resultMatrix = Subtract();
                break;
            case 'Multiply':
                resultMatrix = Multiply();
                break;
            default:
                alert('Invalid operation');
                return;
        }
        displayResultMatrix(resultMatrix);
        displayMatrixDeterminant();
    });

    function displayMatrixDeterminant() {
        const matrix1 = extractMatrixValues(container1);
        const matrix2 = extractMatrixValues(container2);

        if (matrix1.length === matrix1[0].length) {
            let determinant;
            if (matrix1.length === 2) {
                determinant = matrix1[0][0] * matrix1[1][1] - matrix1[0][1] * matrix1[1][0];
            } else if (matrix1.length === 3) {
                determinant = matrix1[0][0] * (matrix1[1][1] * matrix1[2][2] - matrix1[1][2] * matrix1[2][1]) -
                              matrix1[0][1] * (matrix1[1][0] * matrix1[2][2] - matrix1[1][2] * matrix1[2][0]) +
                              matrix1[0][2] * (matrix1[1][0] * matrix1[2][1] - matrix1[1][1] * matrix1[2][0]);
            }
            determinant1.textContent = `Determinant of Matrix 1: ${determinant}`;
        }
        else {
            determinant1.textContent = '';
        }

        if (matrix2.length === matrix2[0].length) {
            let determinant;
            if (matrix2.length === 2) {
                determinant = matrix2[0][0] * matrix2[1][1] - matrix2[0][1] * matrix2[1][0];
            } else if (matrix2.length === 3) {
                determinant = matrix2[0][0] * (matrix2[1][1] * matrix2[2][2] - matrix2[1][2] * matrix2[2][1]) -
                              matrix2[0][1] * (matrix2[1][0] * matrix2[2][2] - matrix2[1][2] * matrix2[2][0]) +
                              matrix2[0][2] * (matrix2[1][0] * matrix2[2][1] - matrix2[1][1] * matrix2[2][0]);
            }
            determinant2.textContent = `Determinant of Matrix 2: ${determinant}`;
        }
        else {
            determinant2.textContent = '';
        }
    }

    updateConstraints();
});