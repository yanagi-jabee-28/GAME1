// 素数ゲームクラス
import { PrimeManager } from './primeManager.js';
import { UIManager } from './uiManager.js';
import { Utils } from './utils.js';

export class PrimeGame {
    constructor() {
        this.primeManager = new PrimeManager();
        this.uiManager = new UIManager();
        this.currentResult = null;
        this.gameHistory = [];
        this.isShowingFactors = false;
        this.initialize();
    }

    /**
     * ゲームを初期化
     */
    initialize() {
        this.setupEventListeners();
        this.setupLevelSelect();
        this.updateLevelDisplay();
        this.updatePrimeButtons();
        this.updateShowFactorsButton();
        this.uiManager.displayPlaceholder('素数の積を生成してください');
        console.log('素数ゲームが初期化されました');
    }

    /**
     * レベル選択を設定
     */
    setupLevelSelect() {
        const levelInfo = this.primeManager.getLevelInfo();
        this.uiManager.populateLevelSelect(levelInfo);
        
        // デフォルトレベルを選択状態にする
        const levelSelect = document.getElementById('level-select');
        if (levelSelect) {
            levelSelect.value = this.primeManager.getCurrentLevel();
        }
    }

    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        // 数字生成ボタン
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generatePrimeProduct());
        }

        // 因数分解表示ボタン
        const showFactorsBtn = document.getElementById('show-factors-btn');
        if (showFactorsBtn) {
            showFactorsBtn.addEventListener('click', () => this.toggleFactors());
        }

        // レベル選択
        const levelSelect = document.getElementById('level-select');
        if (levelSelect) {
            levelSelect.addEventListener('change', (e) => this.changeLevel(parseInt(e.target.value)));
        }

        // 履歴表示ボタン
        const historyBtn = document.getElementById('history-btn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.toggleHistory());
        }

        // キーボードショートカット
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                this.generatePrimeProduct();
            } else if (event.code === 'KeyF') {
                event.preventDefault();
                this.toggleFactors();
            }
        });
    }

    /**
     * 素数の積をランダム生成
     */
    generatePrimeProduct() {
        this.currentResult = this.primeManager.generateRandomProduct();
        this.uiManager.displayNumber(this.currentResult.product);
        
        // 履歴に追加
        this.gameHistory.unshift({
            product: this.currentResult.product,
            primes: [...this.currentResult.primes],
            level: this.primeManager.getCurrentLevel(),
            timestamp: new Date()
        });
        
        // 履歴を最大10件に制限
        if (this.gameHistory.length > 10) {
            this.gameHistory.pop();
        }

        // 因数分解表示をリセット
        this.isShowingFactors = false;
        this.updateFactorDisplay();
        this.updateShowFactorsButton();
        
        // 履歴が表示されている場合は更新
        const historySection = document.getElementById('history-section');
        if (historySection && historySection.style.display !== 'none') {
            this.displayGameHistory();
        }
    }

    /**
     * 因数分解の表示/非表示を切り替え
     */
    toggleFactors() {
        if (!this.currentResult) return;
        
        this.isShowingFactors = !this.isShowingFactors;
        this.updateFactorDisplay();
        this.updateShowFactorsButton();
    }

    /**
     * 因数分解表示を更新
     */
    updateFactorDisplay() {
        const factorDisplay = document.getElementById('factor-display');
        if (!factorDisplay) return;

        if (this.isShowingFactors && this.currentResult) {
            const factors = this.currentResult.primes.join(' × ');
            factorDisplay.textContent = `= ${factors}`;
            factorDisplay.style.display = 'block';
            Utils.addTemporaryClass(factorDisplay, 'animate', 500);
        } else {
            factorDisplay.style.display = 'none';
        }
    }

    /**
     * 因数分解ボタンの表示を更新
     */
    updateShowFactorsButton() {
        const btn = document.getElementById('show-factors-btn');
        if (btn) {
            btn.textContent = this.isShowingFactors ? '🙈 因数分解を隠す' : '👁️ 因数分解を見る';
            btn.disabled = !this.currentResult;
        }
    }

    /**
     * レベルを変更
     * @param {number} level - 新しいレベル
     */
    changeLevel(level) {
        this.primeManager.setLevel(level);
        this.updateLevelDisplay();
        this.updatePrimeButtons();
        
        // 現在の結果をリセット
        this.currentResult = null;
        this.isShowingFactors = false;
        this.updateFactorDisplay();
        this.updateShowFactorsButton();
        this.uiManager.displayPlaceholder('素数の積を生成してください');
    }

    /**
     * レベル表示を更新
     */
    updateLevelDisplay() {
        const levelDisplay = document.getElementById('current-level');
        if (levelDisplay) {
            const primes = this.primeManager.getCurrentPrimes().join(', ');
            levelDisplay.textContent = `レベル ${this.primeManager.getCurrentLevel()} (素数: ${primes})`;
        }
    }

    /**
     * 素数ボタンを更新
     */
    updatePrimeButtons() {
        const primeButtonsContainer = document.getElementById('prime-buttons');
        if (!primeButtonsContainer) return;

        primeButtonsContainer.innerHTML = '';
        const primes = this.primeManager.getCurrentPrimes();

        primes.forEach(prime => {
            const button = document.createElement('button');
            button.className = 'btn btn-prime';
            button.textContent = prime;
            button.title = `素数 ${prime}`;
            
            // クリックイベント（将来の拡張用）
            button.addEventListener('click', () => {
                console.log(`素数 ${prime} がクリックされました`);
                // 今後、素数を使った計算ゲームなどに拡張可能
            });
            
            primeButtonsContainer.appendChild(button);
        });
    }

    /**
     * ゲーム履歴の表示/非表示を切り替え
     */
    toggleHistory() {
        const historySection = document.getElementById('history-section');
        if (historySection) {
            const isVisible = historySection.style.display !== 'none';
            historySection.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                this.displayGameHistory();
            }
        }
    }

    /**
     * ゲーム履歴を表示
     */
    displayGameHistory() {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;

        historyList.innerHTML = '';
        
        if (this.gameHistory.length === 0) {
            historyList.innerHTML = '<li>履歴がありません</li>';
            return;
        }

        this.gameHistory.forEach((entry, index) => {
            const li = document.createElement('li');
            li.className = 'history-item';
            
            const factors = entry.primes.join(' × ');
            li.innerHTML = `
                <div class="history-product">${Utils.formatNumber(entry.product)}</div>
                <div class="history-factors">${factors}</div>
                <div class="history-level">レベル ${entry.level}</div>
            `;
            
            li.style.animationDelay = `${index * 0.1}s`;
            historyList.appendChild(li);
        });
    }

    /**
     * ゲームをリセット
     */
    reset() {
        this.currentResult = null;
        this.gameHistory = [];
        this.isShowingFactors = false;
        this.primeManager.setLevel(1);
        this.updateLevelDisplay();
        this.updatePrimeButtons();
        this.updateFactorDisplay();
        this.updateShowFactorsButton();
        this.uiManager.displayPlaceholder('素数の積を生成してください');
        this.uiManager.toggleVisibility('history-section', false);
    }
}
