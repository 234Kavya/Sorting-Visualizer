// script.js

let array = [];
let arraySizeInput = document.getElementById('arraySize');
let dataModeSelect = document.getElementById('dataMode');
let speedSelect = document.getElementById('speed');
const delay = {
    'low': 300,
    'medium': 150,
    'fast': 50
};

function generateArray() {
    const size = parseInt(arraySizeInput.value);
    const dataMode = dataModeSelect.value;
    
    if (dataMode === 'random') {
        generateRandomArray(size);
    } else if (dataMode === 'manual') {
        // Example of manual input
        array = [/* Array elements manually entered by user */];
        renderArray();
    }
}

function generateRandomArray(size) {
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    renderArray();
}

function renderArray() {
    const arrayContainer = document.getElementById('array');
    arrayContainer.innerHTML = '';
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${array[i]}%`;
        arrayContainer.appendChild(bar);
    }
}

async function bubbleSort() {
    let startTime = performance.now();
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
        }
    }
    let endTime = performance.now();
    displayTimeTaken(endTime - startTime);
}

async function selectionSort() {
    let startTime = performance.now();
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            await swap(i, minIndex);
        }
    }
    let endTime = performance.now();
    displayTimeTaken(endTime - startTime);
}

async function insertionSort() {
    let startTime = performance.now();
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j = j - 1;
            await renderArrayUpdate();
        }
        array[j + 1] = key;
        await renderArrayUpdate();
    }
    let endTime = performance.now();
    displayTimeTaken(endTime - startTime);
}

async function quickSort(start = 0, end = array.length - 1) {
    let startTime = performance.now();
    if (start >= end) {
        let endTime = performance.now();
        displayTimeTaken(endTime - startTime);
        return;
    }
    let index = await partition(start, end);
    await Promise.all([quickSort(start, index - 1), quickSort(index + 1, end)]);
}

async function partition(start, end) {
    let pivotIndex = start;
    let pivotValue = array[end];
    for (let i = start; i < end; i++) {
        if (array[i] < pivotValue) {
            await swap(i, pivotIndex);
            pivotIndex++;
        }
    }
    await swap(pivotIndex, end);
    return pivotIndex;
}

async function mergeSort(start = 0, end = array.length - 1) {
    let startTime = performance.now();
    if (start >= end) {
        let endTime = performance.now();
        displayTimeTaken(endTime - startTime);
        return;
    }
    let mid = Math.floor((start + end) / 2);
    await Promise.all([mergeSort(start, mid), mergeSort(mid + 1, end)]);
    await merge(start, mid, end);
    let endTime = performance.now();
    displayTimeTaken(endTime - startTime);
}

async function merge(start, mid, end) {
    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);
    let k = start;
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            array[k++] = left[i++];
        } else {
            array[k++] = right[j++];
        }
        await renderArrayUpdate();
    }
    while (i < left.length) {
        array[k++] = left[i++];
        await renderArrayUpdate();
    }
    while (j < right.length) {
        array[k++] = right[j++];
        await renderArrayUpdate();
    }
}

function swap(i, j) {
    return new Promise(resolve => {
        setTimeout(() => {
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            renderArray();
            resolve();
        }, delay[speedSelect.value]);
    });
}

function renderArrayUpdate() {
    return new Promise(resolve => {
        setTimeout(() => {
            renderArray();
            resolve();
        }, delay[speedSelect.value]);
    });
}

function displayTimeTaken(time) {
    const timeTakenDiv = document.getElementById('timeTaken');
    timeTakenDiv.textContent = `Time taken: ${time.toFixed(2)} milliseconds`;
}
