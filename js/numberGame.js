// メインゲームクラス
import { NumberGenerator } from './numberGenerator.js';
import { UIManager } from './uiManager.js';

export class NumberGame {
    constructor() {
        this.numberGenerator = new NumberGenerator({
            minValue: 1,
            maxValue: 100,
            maxHistory: 10
        });
        this.uiManager = new UIManager();
        this.isRunning = false;
        this.initialize();
    }

    /**
     * ゲームを初期化
     */
    initialize() {
        this.setupEventListeners();
        this.uiManager.displayPlaceholder('数字を生成してください');
        console.log('数字表示ゲームが初期化されました');
    }

    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        // 数字生成ボタン
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateNumber());
        }

        // 履歴表示ボタン
        const historyBtn = document.getElementById('history-btn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.toggleHistory());
        }

        // 設定ボタン（将来の拡張用）
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }

        // キーボードショートカット
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                this.generateNumber();
            }
        });
    }

    /**
     * 数字を生成して表示
     */
    generateNumber() {
        const number = this.numberGenerator.generate();
        this.uiManager.displayNumber(number);
        
        // 履歴が更新されたら履歴表示も更新
        const historyList = document.getElementById('history-list');
        if (historyList && historyList.style.display !== 'none') {
            this.uiManager.displayHistory(this.numberGenerator.getHistory());
        }
    }

    /**
     * 履歴の表示/非表示を切り替え
     */
    toggleHistory() {
        const historySection = document.getElementById('history-section');
        if (historySection) {
            const isVisible = historySection.style.display !== 'none';
            historySection.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                this.uiManager.displayHistory(this.numberGenerator.getHistory());
            }
        }
    }

    /**
     * 設定画面を開く（将来の拡張用）
     */
    openSettings() {
        alert('設定機能は今後実装予定です！\n現在の範囲: 1-100');
    }

    /**
     * ゲームをリセット
     */
    reset() {
        this.numberGenerator.reset();
        this.uiManager.displayPlaceholder('数字を生成してください');
        this.uiManager.toggleVisibility('history-section', false);
    }

    /**
     * 範囲を変更
     * @param {number} min - 最小値
     * @param {number} max - 最大値
     */
    setRange(min, max) {
        this.numberGenerator.setRange(min, max);
    }
}
