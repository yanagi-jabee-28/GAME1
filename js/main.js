/**
 * 算数ゲーム - 数字表示アプリ
 * ランダムな数字を表示するメイン機能
 */

class NumberDisplayGame {
    constructor() {
        this.currentNumber = 0;
        this.isAutoMode = false;
        this.autoInterval = null;
        
        // 設定管理インスタンスを作成
        this.settings = new GameSettings();
        
        this.initializeElements();
        this.bindEvents();
        this.loadInitialSettings();
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
     * 初期設定を読み込み
     */
    loadInitialSettings() {
        // 保存された設定を読み込んでUIに反映
        this.rangeSelect.value = this.settings.getMaxRange();
        this.speedRange.value = this.settings.getSpeed();
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
        const newNumber = GameUtils.getRandomInt(1, this.settings.getMaxRange());
        this.currentNumber = newNumber;
        this.displayNumber(newNumber);
        AnimationManager.addNumberAnimation(this.numberDisplay);
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
        const color = GameUtils.getNumberColor(number, this.settings.getMaxRange());
        AnimationManager.changeNumberColor(this.numberDisplay, color);
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
        }, this.settings.getSpeed());
        
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
        this.settings.setMaxRange(range);
        
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
        this.settings.setSpeed(speed);
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
        this.speedValue.textContent = GameUtils.formatSpeed(this.settings.getSpeed());
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
            maxRange: this.settings.getMaxRange(),
            speed: this.settings.getSpeed(),
            isAutoMode: this.isAutoMode,
            settings: this.settings.getAllSettings()
        };
    }
}

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', () => {
    // フェードインアニメーション
    const container = document.querySelector('.container');
    AnimationManager.fadeIn(container);
    
    // ゲームインスタンスを作成
    window.numberGame = new NumberDisplayGame();
    
    // デバッグ情報の出力
    GameUtils.debugLog('数字表示ゲームが初期化されました');
    GameUtils.debugLog('キーボードショートカット:', {
        'スペース': '新しい数字を生成',
        'Enter': '自動表示の開始/停止',
        'Escape': '自動表示を停止'
    });
});
