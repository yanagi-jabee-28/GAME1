/**
 * 算数ゲーム - 数字表示アプリ
 * ランダムな数字を表示するメイン機能
 */

class NumberDisplayGame {
    constructor() {
        this.currentNumber = 0;
        this.isAutoMode = false;
        this.autoInterval = null;
        this.maxRange = 100;
        this.speed = 1500; // ミリ秒
        
        this.initializeElements();
        this.bindEvents();
        this.generateRandomNumber();
    }
    
    /**
     * DOM要素の初期化
     */
    initializeElements() {
        this.numberDisplay = document.getElementById('currentNumber');
        this.generateBtn = document.getElementById('generateBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.autoBtn = document.getElementById('autoBtn');
        this.rangeSelect = document.getElementById('rangeSelect');
        this.speedRange = document.getElementById('speedRange');
        this.speedValue = document.getElementById('speedValue');
        
        // 初期状態の設定
        this.pauseBtn.disabled = true;
        this.updateSpeedDisplay();
    }
    
    /**
     * イベントリスナーの設定
     */
    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generateRandomNumber());
        this.pauseBtn.addEventListener('click', () => this.pauseAutoMode());
        this.autoBtn.addEventListener('click', () => this.toggleAutoMode());
        this.rangeSelect.addEventListener('change', (e) => this.updateRange(e.target.value));
        this.speedRange.addEventListener('input', (e) => this.updateSpeed(e.target.value));
        
        // キーボードショートカット
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    /**
     * ランダムな数字を生成して表示
     */
    generateRandomNumber() {
        const newNumber = Math.floor(Math.random() * this.maxRange) + 1;
        this.currentNumber = newNumber;
        this.displayNumber(newNumber);
        this.addNumberAnimation();
    }
    
    /**
     * 数字を画面に表示
     * @param {number} number - 表示する数字
     */
    displayNumber(number) {
        this.numberDisplay.textContent = number;
        
        // 数字の大きさに応じて色を変更
        this.updateNumberColor(number);
    }
    
    /**
     * 数字に応じて色を変更
     * @param {number} number - 数字
     */
    updateNumberColor(number) {
        const percentage = number / this.maxRange;
        let color;
        
        if (percentage < 0.3) {
            color = '#48bb78'; // 緑
        } else if (percentage < 0.7) {
            color = '#4299e1'; // 青
        } else {
            color = '#ed8936'; // オレンジ
        }
        
        this.numberDisplay.style.color = color;
    }
    
    /**
     * 数字表示のアニメーション
     */
    addNumberAnimation() {
        this.numberDisplay.classList.remove('pulse');
        
        // 少し遅延を入れてからアニメーションを開始
        setTimeout(() => {
            this.numberDisplay.classList.add('pulse');
            
            // アニメーション終了後にクラスを削除
            setTimeout(() => {
                this.numberDisplay.classList.remove('pulse');
            }, 1000);
        }, 50);
    }
    
    /**
     * 自動表示モードの切り替え
     */
    toggleAutoMode() {
        if (this.isAutoMode) {
            this.stopAutoMode();
        } else {
            this.startAutoMode();
        }
    }
    
    /**
     * 自動表示モードを開始
     */
    startAutoMode() {
        this.isAutoMode = true;
        this.autoInterval = setInterval(() => {
            this.generateRandomNumber();
        }, this.speed);
        
        // ボタンの状態を更新
        this.autoBtn.textContent = '自動表示停止';
        this.autoBtn.classList.remove('btn-success');
        this.autoBtn.classList.add('btn-secondary');
        this.pauseBtn.disabled = false;
        this.generateBtn.disabled = true;
    }
    
    /**
     * 自動表示モードを停止
     */
    stopAutoMode() {
        this.isAutoMode = false;
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
        
        // ボタンの状態を更新
        this.autoBtn.textContent = '自動表示開始';
        this.autoBtn.classList.remove('btn-secondary');
        this.autoBtn.classList.add('btn-success');
        this.pauseBtn.disabled = true;
        this.generateBtn.disabled = false;
    }
    
    /**
     * 自動表示を一時停止
     */
    pauseAutoMode() {
        if (this.isAutoMode) {
            this.stopAutoMode();
            this.autoBtn.textContent = '自動表示再開';
        }
    }
    
    /**
     * 数字の範囲を更新
     * @param {string} range - 新しい範囲
     */
    updateRange(range) {
        this.maxRange = parseInt(range);
        
        // 現在自動モードの場合は再起動
        if (this.isAutoMode) {
            this.stopAutoMode();
            this.startAutoMode();
        }
        
        // 新しい範囲で数字を生成
        this.generateRandomNumber();
    }
    
    /**
     * 表示速度を更新
     * @param {string} speed - 新しい速度（ミリ秒）
     */
    updateSpeed(speed) {
        this.speed = parseInt(speed);
        this.updateSpeedDisplay();
        
        // 自動モードが有効な場合は再起動
        if (this.isAutoMode) {
            this.stopAutoMode();
            this.startAutoMode();
        }
    }
    
    /**
     * 速度表示を更新
     */
    updateSpeedDisplay() {
        const seconds = (this.speed / 1000).toFixed(1);
        this.speedValue.textContent = `${seconds}秒`;
    }
    
    /**
     * キーボードショートカットの処理
     * @param {KeyboardEvent} e - キーボードイベント
     */
    handleKeyboard(e) {
        switch(e.key) {
            case ' ': // スペースキー
                e.preventDefault();
                if (!this.isAutoMode) {
                    this.generateRandomNumber();
                }
                break;
            case 'Enter': // エンターキー
                e.preventDefault();
                this.toggleAutoMode();
                break;
            case 'Escape': // ESCキー
                if (this.isAutoMode) {
                    this.stopAutoMode();
                }
                break;
        }
    }
    
    /**
     * ゲームの統計情報（将来の拡張用）
     */
    getStats() {
        return {
            currentNumber: this.currentNumber,
            maxRange: this.maxRange,
            speed: this.speed,
            isAutoMode: this.isAutoMode
        };
    }
}

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', () => {
    // フェードインアニメーション
    document.querySelector('.container').classList.add('fade-in');
    
    // ゲームインスタンスを作成
    window.numberGame = new NumberDisplayGame();
    
    // デバッグ用（開発中のみ）
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('数字表示ゲームが初期化されました');
        console.log('キーボードショートカット:');
        console.log('- スペース: 新しい数字を生成');
        console.log('- Enter: 自動表示の開始/停止');
        console.log('- Escape: 自動表示を停止');
    }
});
