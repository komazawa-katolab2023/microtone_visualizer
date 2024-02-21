document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    // 長方形の位置とサイズを定義（2つの長方形）
    const rects = [
        { x: 50, y: 50, width: 100, height: 50 },
        { x: 200, y: 50, width: 100, height: 50 }
    ];

    // 2つの長方形を描画
    rects.forEach(rect => {
        ctx.fillStyle = 'skyblue';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    });

    // Web Audio APIを初期化
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    function playSound(frequency) {
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine'; // 音の形状
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // 周波数を設定
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5); // 0.5秒後に停止
    }

    // イベントの処理をまとめた関数（マルチタッチ対応）
    function handleEvent(event) {
        event.preventDefault(); // デフォルトの動作を防ぐ

        const touches = event.type === 'touchstart' ? event.touches : [event];
        const rectCanvas = canvas.getBoundingClientRect();

        for (let i = 0; i < touches.length; i++) {
            const x = touches[i].clientX - rectCanvas.left;
            const y = touches[i].clientY - rectCanvas.top;

            // それぞれの長方形内か判断し、対応する音を鳴らす
            rects.forEach((rect, index) => {
                if (x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height) {
                    playSound(index === 0 ? 440 : 660); // 2つの異なる周波数
                }
            });
        }
    }

    // タッチイベントとクリックイベントの両方に対応
    canvas.addEventListener('touchstart', handleEvent);
    canvas.addEventListener('mousedown', handleEvent);
});
