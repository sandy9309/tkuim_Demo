let selectedElement = null;
let isDragging = false;
let startX, startY;
let initialLeft, initialTop;

function addFurniture(name, sizeClass, color) {
    const floor = document.getElementById('room-floor');
    const el = document.createElement('div');
    
    el.className = `furniture-object ${sizeClass} rounded-md`;
    el.style.backgroundColor = color;
    el.style.left = '50px';
    el.style.top = '50px';
    el.innerText = name;
    el.dataset.name = name;
    el.dataset.rotate = 0;

    el.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        selectElement(el);
        startDrag(e, el);
    });

    floor.appendChild(el);
    selectElement(el);
}

function startDrag(e, el) {
    isDragging = true;
    selectedElement = el;

    startX = e.clientX;
    startY = e.clientY;
    initialLeft = parseInt(el.style.left);
    initialTop = parseInt(el.style.top);

    document.addEventListener('pointermove', onDrag);
    document.addEventListener('pointerup', stopDrag);
}

function onDrag(e) {
    if (!isDragging || !selectedElement) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    selectedElement.style.left = `${initialLeft + dx}px`;
    selectedElement.style.top = `${initialTop + dy}px`;
}

function stopDrag() {
    isDragging = false;
    document.removeEventListener('pointermove', onDrag);
    document.removeEventListener('pointerup', stopDrag);
}

function selectElement(el) {
    if (selectedElement) selectedElement.classList.remove('selected');
    selectedElement = el;
    selectedElement.classList.add('selected');

    document.getElementById('no-selection-msg').classList.add('hidden');
    document.getElementById('controls').classList.remove('hidden');

    document.getElementById('selected-name').innerText = el.dataset.name;
    document.getElementById('rotate-slider').value = el.dataset.rotate || 0;
    document.getElementById('opacity-slider').value = (el.style.opacity * 100) || 100;
}

function updateFurniture() {
    if (!selectedElement) return;
    const rotation = document.getElementById('rotate-slider').value;
    const opacity = document.getElementById('opacity-slider').value;

    selectedElement.dataset.rotate = rotation;
    selectedElement.style.transform = `rotateZ(${rotation}deg)`;
    selectedElement.style.opacity = opacity / 100;
}

function deleteSelected() {
    if (selectedElement) {
        selectedElement.remove();
        selectedElement = null;
        document.getElementById('no-selection-msg').classList.remove('hidden');
        document.getElementById('controls').classList.add('hidden');
    }
}

function resetFloor() {
    document.getElementById('room-floor').style.transform = "rotateX(55deg) rotateZ(-15deg)";
}

document.getElementById('viewport').onclick = function() {
    if (!isDragging && selectedElement) {
        selectedElement.classList.remove('selected');
        selectedElement = null;
        document.getElementById('no-selection-msg').classList.remove('hidden');
        document.getElementById('controls').classList.add('hidden');
    }
};