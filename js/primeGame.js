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
		this.currentNumber = null; // 現在表示されている数字
		this.remainingFactors = []; // 残りの因数
		this.usedFactors = []; // 使用済みの因数
		this.initialize();
	}    /**
     * ゲームを初期化
     */
	initialize() {
		this.setupEventListeners();
		this.setupLevelSelect();
		this.updateLevelDisplay();
		this.updatePrimeButtons();
		this.updateShowFactorsButton();
		this.updateUsedFactorsDisplay();
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
	}    /**
     * 素数の積をランダム生成
     */
	generatePrimeProduct() {
		this.currentResult = this.primeManager.generateRandomProduct();
		this.currentNumber = this.currentResult.product;
		this.remainingFactors = [...this.currentResult.primes];
		this.usedFactors = [];

		this.uiManager.displayNumber(this.currentNumber);

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
		this.updatePrimeButtons();

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
		if (!factorDisplay) return; if (this.isShowingFactors && this.currentResult) {
			const factors = this.currentResult.primes.join(' × ');
			factorDisplay.textContent = `= ${factors}`;
			factorDisplay.style.display = 'block';
			factorDisplay.style.opacity = '1';
			Utils.addTemporaryClass(factorDisplay, 'animate', 500);
		} else {
			factorDisplay.style.display = 'none';
			factorDisplay.style.opacity = '0';
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
	}    /**
     * レベルを変更
     * @param {number} level - 新しいレベル
     */
	changeLevel(level) {
		this.primeManager.setLevel(level);
		this.updateLevelDisplay();
		this.updatePrimeButtons();

		// 現在の結果をリセット
		this.currentResult = null;
		this.currentNumber = null;
		this.remainingFactors = [];
		this.usedFactors = [];
		this.isShowingFactors = false;
		this.updateFactorDisplay();
		this.updateShowFactorsButton();
		this.uiManager.displayPlaceholder('素数の積を生成してください');
	}    /**
     * レベル表示を更新
     */
	updateLevelDisplay() {
		const levelDisplay = document.getElementById('current-level');
		if (levelDisplay) {
			const level = this.primeManager.getCurrentLevel();
			const primes = this.primeManager.getCurrentPrimes().join(', ');

			// レベルごとの説明を追加
			let description = '';
			switch (level) {
				case 1:
					description = ' - 簡単（2-3個の因数）';
					break;
				case 2:
					description = ' - 普通（3-4個の因数）';
					break;
				case 3:
					description = ' - 難しい（4-6個の因数）';
					break;
				case 4:
					description = ' - とても難しい（新しい素数を含む）';
					break;
				case 5:
					description = ' - 超難しい（最も大きな素数を含む）';
					break;
			}

			levelDisplay.textContent = `レベル ${level} (素数: ${primes})${description}`;
		}
	}/**
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

			// 数字が生成されていない場合のみ無効化
			if (!this.currentNumber) {
				button.disabled = true;
				button.classList.add('disabled');
			}

			// クリックイベント
			button.addEventListener('click', () => {
				this.attemptDivision(prime);
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
	}    /**
     * 指定した素数で現在の数字を割ろうと試みる
     * @param {number} prime - 割ろうとする素数
     */
	attemptDivision(prime) {
		if (!this.currentNumber) {
			return;
		}

		// 割り切れるかチェック
		if (this.currentNumber % prime === 0) {
			// 正解の場合
			this.performCorrectDivision(prime);
		} else {
			// 不正解の場合
			this.showIncorrectFeedback(prime);
		}
	}

	/**
	 * 正解時の割り算を実行
	 * @param {number} prime - 割る素数
	 */
	performCorrectDivision(prime) {
		// 数字を割る
		this.currentNumber = this.currentNumber / prime;
		this.usedFactors.push(prime);

		// 残りの因数から削除
		const factorIndex = this.remainingFactors.indexOf(prime);
		if (factorIndex !== -1) {
			this.remainingFactors.splice(factorIndex, 1);
		}

		// 新しい数字を表示
		this.uiManager.displayNumber(this.currentNumber);

		// 正解フィードバック
		this.showCorrectFeedback(prime);

		// 使用した因数を表示
		this.updateUsedFactorsDisplay();

		// 素数ボタンの状態を更新
		this.updatePrimeButtons();

		// 1になったら完了
		if (this.currentNumber === 1) {
			this.onFactorizationComplete();
		}
	}

	/**
	 * 正解時のフィードバックを表示
	 * @param {number} prime - 使用した素数
	 */
	showCorrectFeedback(prime) {
		const numberDisplay = document.getElementById('number-display');
		if (numberDisplay) {
			// 一時的に正解エフェクトを追加
			numberDisplay.classList.add('correct');
			setTimeout(() => {
				numberDisplay.classList.remove('correct');
			}, 800);
		}

		// 音や視覚効果を追加（オプション）
		this.createFloatingText(`✅ 正解！÷${prime}`, 'success');
	}

	/**
	 * 不正解時のフィードバックを表示
	 * @param {number} prime - 使用しようとした素数
	 */
	showIncorrectFeedback(prime) {
		const numberDisplay = document.getElementById('number-display');
		if (numberDisplay) {
			// 一時的に不正解エフェクトを追加
			numberDisplay.classList.add('incorrect');
			setTimeout(() => {
				numberDisplay.classList.remove('incorrect');
			}, 800);
		}

		// 不正解メッセージを表示
		this.createFloatingText(`❌ ${this.currentNumber}は${prime}で割り切れません`, 'error');
	}

    /**
     * フローティングテキストを作成
     * @param {string} text - 表示するテキスト
     * @param {string} type - タイプ（'success' または 'error'）
     */    createFloatingText(text, type) {
		const calculationArea = document.getElementById('calculation-area');
		if (!calculationArea) return;

		const floatingText = document.createElement('div');
		floatingText.className = `floating-text ${type}`;
		floatingText.textContent = text;

		// 既存の要素を避けるための位置調整
		this.positionFloatingText(floatingText, calculationArea);

		calculationArea.appendChild(floatingText);

		// アニメーション後に削除
		setTimeout(() => {
			if (floatingText.parentNode) {
				floatingText.parentNode.removeChild(floatingText);
			}
		}, 2000);
	}    /**
     * フローティングテキストの位置を調整（正解は重ねる、不正解は避ける）
     */    positionFloatingText(floatingText, calculationArea) {
		const existingFloatingTexts = calculationArea.querySelectorAll('.floating-text');
		
		// 計算エリアの上部（数字表示と計算式の間）に配置
		let topPosition = 10; // 上部から10px
		
		// 正解メッセージの場合は重ねても良い、不正解メッセージの場合は避ける
		if (floatingText.classList.contains('error')) {
			// 不正解の場合は既存のテキストを避けて配置
			if (existingFloatingTexts.length > 0) {
				topPosition = 10 + (existingFloatingTexts.length * 45); // 45px間隔で配置
			}
		} else {
			// 正解や情報メッセージの場合は基本位置に配置（重ねる）
			topPosition = 10;
		}

		floatingText.style.top = `${topPosition}px`;
		
		// 水平方向は中央
		floatingText.style.left = '50%';
	}/**
     * 使用済み因数の表示を更新
     */
	updateUsedFactorsDisplay() {
		const factorDisplay = document.getElementById('factor-display');
		if (factorDisplay && this.usedFactors.length > 0) {
			// 元の数字を計算
			const originalNumber = this.currentResult.product;
			const factorText = this.usedFactors.join(' × ');

			if (this.currentNumber === 1) {
				// 因数分解完了
				factorDisplay.textContent = `✨ ${originalNumber} = ${factorText}`;
				factorDisplay.classList.add('complete');
			} else {
				// 進行中の表示: 括弧を使って正しい計算順序を示す
				if (this.usedFactors.length === 1) {
					factorDisplay.textContent = `${originalNumber} ÷ ${factorText} = ${this.currentNumber}`;
				} else {
					factorDisplay.textContent = `${originalNumber} ÷ (${factorText}) = ${this.currentNumber}`;
				}
				factorDisplay.classList.remove('complete');
			}
			factorDisplay.style.display = 'block';
			factorDisplay.style.opacity = '1';
			Utils.addTemporaryClass(factorDisplay, 'animate', 500);
		} else if (factorDisplay && this.usedFactors.length === 0) {
			factorDisplay.style.display = 'none';
			factorDisplay.style.opacity = '0';
		}
	}    /**
     * 因数分解完了時の処理
     */    onFactorizationComplete() {
        // 使用済み因数表示を更新（完了状態）
        this.updateUsedFactorsDisplay();
        
        // 素数ボタンを無効化
        const primeButtons = document.querySelectorAll('.btn-prime');
        primeButtons.forEach(button => {
            button.disabled = true;
            button.classList.add('disabled');
        });

        // 少し遅らせて完了フィードバック（因数分解表示の後に表示）
        setTimeout(() => {
            this.createFloatingText('🎉 因数分解完了！', 'success');
        }, 300);
          // 1.5秒後に次の問題の準備中メッセージを表示
        setTimeout(() => {
            // フローティングテキストとして準備中メッセージを表示
            this.createFloatingText('🔄 次の問題を準備中...', 'info');
            
            // 0.5秒後に新しい数字を自動生成（合計2秒後）
            setTimeout(() => {
                this.generatePrimeProduct();
            }, 500);
        }, 1500);
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
		this.currentNumber = null;
		this.remainingFactors = [];
		this.usedFactors = [];
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
