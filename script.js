const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const keyMap = '1234567890QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
let frequencies = [];
let oscillators = {};  // 新しいオシレーターを保存するためのオブジェクト

function startPlayingFrequency(frequency, key) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();

    oscillators[key] = oscillator;  // オシレーターを保存
    highlightKey(keyMap.indexOf(key));
}

function stopPlayingFrequency(key) {
    if (oscillators[key]) {
        oscillators[key].stop();
        oscillators[key].disconnect();
        delete oscillators[key];  // 停止したオシレーターを削除
        removeHighlight(keyMap.indexOf(key));
    }
}

function generateScale() {
    const division = Math.min(document.getElementById('division').value, 31); // 最大31分割まで
    const rootFrequency = 440; // A4の周波数
    frequencies = [];

    for (let i = 0; i < division; i++) {
        const frequency = rootFrequency * Math.pow(2, i / division);
        frequencies.push(frequency);
    }

    updateKeyboardLayout(division);
}

function updateKeyboardLayout(division) {
    const notesDiv = document.getElementById('circle-container');
    const freqDiv = document.getElementById('frequencies');
    notesDiv.innerHTML = '';
    freqDiv.innerHTML = '';  // 周波数表示エリアをクリア
    const radius = 120; // 円の半径

    for (let i = 0; i < division; i++) {
        // 角度の計算を変更して円の上部から始める
        const angle = (i / division) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * radius + radius;
        const y = Math.sin(angle) * radius + radius;
        const hue = i * (360 / division);
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';
        noteDiv.style.left = `${x}px`;
        noteDiv.style.top = `${y}px`;
        noteDiv.style.background = `hsl(${hue}, 100%, 50%)`;
        noteDiv.textContent = keyMap[i];
        noteDiv.onclick = () => playFrequency(frequencies[i]);
        notesDiv.appendChild(noteDiv);

        const freqSpan = document.createElement('div');
        freqSpan.innerHTML = `${keyMap[i]}=${frequencies[i].toFixed(2)}Hz `;
        freqDiv.appendChild(freqSpan);
    }
}

function playFrequency(frequency, keyIndex) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);

    highlightKey(keyIndex);
}

function highlightKey(keyIndex) {
    const notes = document.getElementsByClassName('note');
    for (let i = 0; i < notes.length; i++) {
        notes[i].style.border = (i === keyIndex) ? '2px solid black' : 'none';
    }
}

function handleKeyDown(event) {
    const key = event.key.toUpperCase();
    const keyIndex = keyMap.indexOf(key);
    if (keyIndex >= 0 && keyIndex < frequencies.length && !oscillators[key]) {
        startPlayingFrequency(frequencies[keyIndex], key);
    }
}

function handleKeyUp(event) {
    const key = event.key.toUpperCase();
    if (oscillators[key]) {
        stopPlayingFrequency(key);
    }
}

window.onload = () => {
    generateScale();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
};