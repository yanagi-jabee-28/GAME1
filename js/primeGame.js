// 素数ゲームクラス
import { PrimeManager } from './primeManager.js';
import { UIManager } from './uiManager.js';
import { Utils } from './utils.js';

export class PrimeGame {
	constructor() {
		this.primeManager = new PrimeManager();
		this.uiManager = new UIManager();
		this.currentResult = null;		this.gameHistory = [];
		this.isShowingAnswer = false;
		this.currentNumber = null; // 現在表示されている数字
		this.selectedFactors = []; // ユーザーが選択した因数
		this.originalNumber = null; // 元の数字（リセット用）
		this.usedFactors = []; // 実際に使用された因数（段階的割り算用）
		this.autoProgress = true; // 自動進行を制御
		this.nextProblemTimeout = null; // 次の問題生成のタイマー
		this.initialize();
	}	/**
     * ゲームを初期化
     */	initialize() {
		this.setupEventListeners();
		this.setupLevelSelect();
		this.updateLevelDisplay();		this.updatePrimeButtons();
		this.updateSubmitAnswerButton();
		this.updateShowAnswerButton();
		this.updateClearButton();
		this.updateUserFactorsDisplay();
		this.updateAutoProgressButton();
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
	}	/**
	 * イベントリスナーを設定
	 */
	setupEventListeners() {
		// 数字生成ボタン
		const generateBtn = document.getElementById('generate-btn');
		if (generateBtn) {
			generateBtn.addEventListener('click', () => this.generatePrimeProduct());
		}

		// 解答するボタン（新機能）
		const submitAnswerBtn = document.getElementById('submit-answer-btn');
		if (submitAnswerBtn) {
			submitAnswerBtn.addEventListener('click', () => this.submitAnswer());
		}
		// 解答表示ボタン
		const showAnswerBtn = document.getElementById('show-answer-btn');
		if (showAnswerBtn) {
			showAnswerBtn.addEventListener('click', () => this.showAnswer());
		}

		// 選択クリアボタン
		const clearBtn = document.getElementById('clear-selection-btn');
		if (clearBtn) {
			clearBtn.addEventListener('click', () => this.clearAllSelections());
		}

		// レベル選択
		const levelSelect = document.getElementById('level-select');
		if (levelSelect) {
			levelSelect.addEventListener('change', (e) => this.changeLevel(parseInt(e.target.value)));
		}

		// 履歴表示ボタン		const historyBtn = document.getElementById('history-btn');
		if (historyBtn) {
			historyBtn.addEventListener('click', () => this.toggleHistory());
		}

		const autoProgressBtn = document.getElementById('auto-progress-btn');
		if (autoProgressBtn) {
			autoProgressBtn.addEventListener('click', () => {
				this.toggleAutoProgress();
				this.updateAutoProgressButton();
			});
		}
		// キーボードショートカット
		document.addEventListener('keydown', (event) => {
			if (event.code === 'Space') {
				event.preventDefault();
				this.generatePrimeProduct();
			} else if (event.code === 'Enter') {
				event.preventDefault();
				this.submitAnswer();
			} else if (event.code === 'KeyA') {
				event.preventDefault();
				this.showAnswer();
			} else if (event.code === 'KeyP') {
				event.preventDefault();
				this.toggleAutoProgress();
			} else if (event.code === 'KeyC') {
				event.preventDefault();
				this.clearSelection();
			} else if (event.code === 'KeyH') {
				event.preventDefault();
				this.toggleHistory();
			}
		});
	}/**
     * 素数の積をランダム生成
     */	generatePrimeProduct() {
		this.currentResult = this.primeManager.generateRandomProduct();
		this.currentNumber = this.currentResult.product;
		this.originalNumber = this.currentResult.product;
		this.selectedFactors = [];
		this.usedFactors = [];
		this.isShowingAnswer = false;

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
		}		// UI更新
		this.updateFactorDisplay();
		this.updateSubmitAnswerButton();
		this.updateShowAnswerButton();
		this.updatePrimeButtons();
		this.updateUserFactorsDisplay();
		this.updateClearButton();

		// 履歴が表示されている場合は更新
		const historySection = document.getElementById('history-section');
		if (historySection && historySection.style.display !== 'none') {
			this.displayGameHistory();
		}
	}	/**
	 * 解答を表示（正解の因数分解を表示）
	 */
	showAnswer() {
		if (!this.currentResult) return;

		this.isShowingAnswer = true;
		this.updateFactorDisplay();
		this.updateShowAnswerButton();
		this.updatePrimeButtons();
		this.updateSubmitAnswerButton();

		// 正解の因数分解を表示
		this.createFloatingText('💡 正解の因数分解を表示中', 'info');
	}
	/**
	 * 因数分解表示を更新
	 */
	updateFactorDisplay() {
		const factorDisplay = document.getElementById('factor-display');
		if (!factorDisplay) return;

		if (this.isShowingAnswer && this.currentResult) {
			// 解答表示中：正解の因数分解を表示
			const factors = this.currentResult.primes.join(' × ');
			factorDisplay.textContent = `正解: ${this.originalNumber || this.currentResult.product} = ${factors}`;
			factorDisplay.style.display = 'block';
			factorDisplay.style.opacity = '1';
			Utils.addTemporaryClass(factorDisplay, 'animate', 500);
		} else if (this.usedFactors.length > 0) {
			// 段階的進行中：進捗を表示
			this.updateProgressDisplay();
		} else {
			// 何も表示しない
			factorDisplay.style.display = 'none';
			factorDisplay.style.opacity = '0';
		}
	}

	/**
	 * 解答ボタンの表示を更新
	 */
	updateShowAnswerButton() {
		const btn = document.getElementById('show-answer-btn');
		if (btn) {
			btn.textContent = this.isShowingAnswer ? '💡 解答表示中' : '💡 解答を見る';
			btn.disabled = !this.currentResult || this.isShowingAnswer;
		}
	}	/**
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
		this.originalNumber = null; this.selectedFactors = [];
		this.usedFactors = [];
		this.isShowingAnswer = false;
		this.updateFactorDisplay();
		this.updateSubmitAnswerButton();
		this.updateShowAnswerButton();
		this.updateUserFactorsDisplay();
		this.updateClearButton();
		this.uiManager.displayPlaceholder('素数の積を生成してください');
	}/**
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
	}	/**
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

			// 無効化条件：数字が生成されていない、解答表示中、完了済み
			if (!this.currentNumber || this.isShowingAnswer || this.currentNumber === 1) {
				button.disabled = true;
				button.classList.add('disabled');
			}			// クリックイベント - 因数を選択
			button.addEventListener('click', () => {
				this.selectFactor(prime);
			});

			// 右クリックイベント - 選択を取り消し
			button.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				this.deselectFactor(prime);
			});

			primeButtonsContainer.appendChild(button);
		});
	}
	/**
	 * 因数を選択（内部的に記録）
	 * @param {number} prime - 選択した素数
	 */
	selectFactor(prime) {
		if (!this.currentNumber || this.isShowingAnswer) {
			return;
		}

		// 選択した因数を記録
		this.selectedFactors.push(prime);
		this.selectedFactors.sort((a, b) => a - b);
		// ユーザーの選択を表示
		this.updateUserFactorsDisplay();
		this.updateSubmitAnswerButton();
		this.updateClearButton();

		// フィードバック（選択したことを示す）
		this.createFloatingText(`✏️ ${prime} を選択`, 'info');
	}
	/**
	 * 因数の選択を取り消し
	 * @param {number} prime - 取り消したい素数
	 */
	deselectFactor(prime) {
		if (!this.currentNumber || this.isShowingAnswer) {
			return;
		}

		// 選択から削除（最初に見つかった一つのみ）
		const index = this.selectedFactors.indexOf(prime);
		if (index !== -1) {
			this.selectedFactors.splice(index, 1);
			// 表示を更新
			this.updateUserFactorsDisplay();
			this.updateSubmitAnswerButton();
			this.updateClearButton();

			// フィードバック
			this.createFloatingText(`🗑️ ${prime} を取り消し`, 'info');
		}
	}
	/**
	 * 全選択をクリア
	 */
	clearAllSelections() {
		if (this.selectedFactors.length > 0) {
			this.selectedFactors = [];
			this.updateUserFactorsDisplay();
			this.updateSubmitAnswerButton();
			this.updateClearButton();
			this.createFloatingText('🗑️ 全選択をクリア', 'info');
		}
	}
	/**
	 * ユーザーが選択した因数の表示を更新
	 */
	updateUserFactorsDisplay() {
		const userFactorsDisplay = document.getElementById('user-factors');
		if (!userFactorsDisplay) return;

		if (this.selectedFactors.length > 0) {
			const factorText = this.selectedFactors.join(' × ');
			userFactorsDisplay.textContent = `選択中: ${factorText}`;
			userFactorsDisplay.style.display = 'block';
			userFactorsDisplay.style.opacity = '1';
			Utils.addTemporaryClass(userFactorsDisplay, 'animate', 500);
		} else {
			userFactorsDisplay.style.display = 'none';
			userFactorsDisplay.style.opacity = '0';
		}
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
	}	/**
	 * フローティングテキストを作成
	 * @param {string} text - 表示するテキスト
	 * @param {string} type - タイプ（'success', 'error', 'info'）
	 */
	createFloatingText(text, type) {
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
	}

	/**
	 * フローティングテキストの位置を調整（全てのメッセージを同じ位置に重ねる）
	 */
	positionFloatingText(floatingText, calculationArea) {
		// 計算エリアの上部（数字表示と計算式の間）に配置
		const topPosition = 10; // 上部から10px

		// 全てのメッセージタイプ（正解、不正解、情報）を同じ位置に配置（重ねる）
		floatingText.style.top = `${topPosition}px`;

		// 水平方向は中央
		floatingText.style.left = '50%';
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
	}	/**
	 * ゲームをリセット
	 */	reset() {
		// タイマーをクリア
		if (this.nextProblemTimeout) {
			clearTimeout(this.nextProblemTimeout);
			this.nextProblemTimeout = null;
		}

		this.currentResult = null;
		this.currentNumber = null;
		this.originalNumber = null;
		this.selectedFactors = [];
		this.usedFactors = [];
		this.gameHistory = [];
		this.isShowingAnswer = false;
		this.autoProgress = true;
		this.primeManager.setLevel(1);
		this.updateLevelDisplay();
		this.updatePrimeButtons();
		this.updateFactorDisplay();
		this.updateSubmitAnswerButton();
		this.updateShowAnswerButton();
		this.updateUserFactorsDisplay();
		this.updateAutoProgressButton();
		this.uiManager.displayPlaceholder('素数の積を生成してください');
		this.uiManager.toggleVisibility('history-section', false);
	}

	/**
	 * ユーザーの解答を正誤判定
	 * @returns {boolean} 正解かどうか
	 */
	checkAnswer() {
		if (!this.currentResult || this.selectedFactors.length === 0) {
			return false;
		}

		// ユーザーの選択をソートして比較用配列を作成
		const userFactors = [...this.selectedFactors].sort((a, b) => a - b);
		const correctFactors = [...this.currentResult.primes].sort((a, b) => a - b);

		// 配列の長さが違う場合は不正解
		if (userFactors.length !== correctFactors.length) {
			return false;
		}

		// 要素を一つずつ比較
		for (let i = 0; i < userFactors.length; i++) {
			if (userFactors[i] !== correctFactors[i]) {
				return false;
			}
		}

		return true;
	}

	/**
	 * 不正解時の処理：正解の因数で数字を割る
	 */
	processIncorrectAnswer() {
		// 不正解メッセージを表示
		this.createFloatingText('❌ 不正解です。正解の因数で割ります...', 'error');

		// ユーザーが選択した因数のうち、正解に含まれるものを特定
		const correctFactors = this.currentResult.primes;
		const validUserFactors = this.selectedFactors.filter(factor =>
			correctFactors.includes(factor)
		);

		// 段階的に割り算を実行
		let tempNumber = this.currentNumber;
		let usedFactors = [];
		// 0.5秒後から開始
		setTimeout(() => {
			this.performStepByStepDivision(tempNumber, correctFactors, usedFactors, 0);
		}, 500);
	}

	/**
	 * 段階的な割り算を実行
	 * @param {number} currentNum 現在の数字
	 * @param {number[]} factors 使用する因数配列
	 * @param {number[]} usedFactors 使用済み因数
	 * @param {number} index 現在のインデックス
	 */
	performStepByStepDivision(currentNum, factors, usedFactors, index) {
		if (index >= factors.length || currentNum === 1) {
			// 全ての因数で割り終わったら完了メッセージ
			this.onDivisionComplete(usedFactors);
			return;
		}

		const factor = factors[index];
		const newNumber = currentNum / factor;
		usedFactors.push(factor);

		// 数字表示を更新
		this.currentNumber = newNumber;
		this.uiManager.displayNumber(this.currentNumber);

		// 割り算のフィードバック
		this.createFloatingText(`÷${factor} = ${newNumber}`, 'info');

		// 使用済み因数表示を更新
		this.updateDivisionDisplay(usedFactors, this.currentResult.product);

		// 数字にエフェクトを追加
		const numberDisplay = document.getElementById('number-display');
		if (numberDisplay) {
			numberDisplay.classList.add('division-effect');
			setTimeout(() => {
				numberDisplay.classList.remove('division-effect');
			}, 600);
		}
		// 次の因数で割る（1秒後）
		setTimeout(() => {
			this.performStepByStepDivision(newNumber, factors, usedFactors, index + 1);
		}, 1000);
	}

	/**
	 * 割り算過程の表示を更新
	 * @param {number[]} usedFactors 使用済み因数
	 * @param {number} originalNumber 元の数字
	 */
	updateDivisionDisplay(usedFactors, originalNumber) {
		const factorDisplay = document.getElementById('factor-display');
		if (!factorDisplay) return;

		if (usedFactors.length > 0) {
			const factorText = usedFactors.join(' × ');

			if (this.currentNumber === 1) {
				// 完了時
				factorDisplay.textContent = `✨ ${originalNumber} = ${factorText}`;
				factorDisplay.classList.add('complete');
			} else {
				// 進行中
				factorDisplay.textContent = `${originalNumber} ÷ (${factorText}) = ${this.currentNumber}`;
				factorDisplay.classList.remove('complete');
			}

			factorDisplay.style.display = 'block';
			factorDisplay.style.opacity = '1';
		}
	}

	/**
	 * 割り算完了時の処理
	 * @param {number[]} usedFactors 使用した因数
	 */
	onDivisionComplete(usedFactors) {
		// 完了メッセージ
		this.createFloatingText('✅ 因数分解完了！', 'success');

		// 素数ボタンを無効化
		const primeButtons = document.querySelectorAll('.btn-prime');
		primeButtons.forEach(button => {
			button.disabled = true;
			button.classList.add('disabled');
		});		// 自動進行または手動進行
		if (this.autoProgress) {
			// 1.5秒後に新しい問題を自動生成
			this.nextProblemTimeout = setTimeout(() => {
				this.createFloatingText('🔄 新しい問題を準備中...', 'info');
				setTimeout(() => {
					this.generatePrimeProduct();
				}, 300);
			}, 1500);
		} else {
			// 手動進行：ユーザーが次の問題ボタンを押すまで待機
			this.createFloatingText('✅ 完了！次の問題ボタンを押してください', 'info');
			this.showNextProblemButton();
		}
	}	/**
	 * ユーザーの解答を実行（選択した因数で実際に割り算）
	 */
	submitAnswer() {
		if (!this.currentNumber || this.selectedFactors.length === 0 || this.isShowingAnswer) {
			return;
		}

		// 現在までの使用因数と選択因数を合わせて正解と比較
		const allUsedFactors = [...this.usedFactors, ...this.selectedFactors];
		const isValidSelection = this.isValidFactorSelection(allUsedFactors);

		if (!isValidSelection) {
			this.createFloatingText(`❌ 選択した因数では正しい因数分解になりません`, 'error');
			this.selectedFactors = [];
			this.updateUserFactorsDisplay();
			this.updateSubmitAnswerButton();
			return;
		}

		// 現在の数字が選択された因数の積で割り切れるかチェック
		const product = this.selectedFactors.reduce((acc, factor) => acc * factor, 1);
		if (this.currentNumber % product !== 0) {
			this.createFloatingText(`❌ 選択した因数 ${this.selectedFactors.join('×')} では割り切れません`, 'error');
			this.selectedFactors = [];
			this.updateUserFactorsDisplay();
			this.updateSubmitAnswerButton();
			return;
		}

		// 選択した因数で実際に割り算を試行
		let tempNumber = this.currentNumber;
		const validFactors = [...this.selectedFactors]; // 事前チェックで有効性を確認済み

		// 因数を使用済みに追加
		this.usedFactors.push(...validFactors);

		// 割り算を実行
		tempNumber = this.currentNumber / product;
		this.performActualDivision(validFactors, tempNumber);

		// 選択をリセット
		this.selectedFactors = [];
		this.updateUserFactorsDisplay();
		this.updateSubmitAnswerButton();
	}

	/**
	 * 選択された因数が有効かどうかをチェック
	 * @param {number[]} factors チェックする因数配列
	 * @returns {boolean} 有効かどうか
	 */
	isValidFactorSelection(factors) {
		if (!this.currentResult) return false;

		// 各因数の使用回数をカウント
		const factorCount = {};
		factors.forEach(factor => {
			factorCount[factor] = (factorCount[factor] || 0) + 1;
		});

		// 正解の因数の使用回数をカウント
		const correctFactorCount = {};
		this.currentResult.primes.forEach(prime => {
			correctFactorCount[prime] = (correctFactorCount[prime] || 0) + 1;
		});

		// 各因数の使用回数が正解を超えていないかチェック
		for (const [factor, count] of Object.entries(factorCount)) {
			const maxAllowed = correctFactorCount[factor] || 0;
			if (count > maxAllowed) {
				console.log(`因数 ${factor} を ${count} 回使用していますが、正解では ${maxAllowed} 回しか使われません`);
				return false;
			}
		}

		return true;
	}

	/**
	 * 実際の割り算を実行
	 * @param {number[]} validFactors 有効な因数
	 * @param {number} newNumber 新しい数字
	 */
	performActualDivision(validFactors, newNumber) {
		// 数字を更新
		this.currentNumber = newNumber;
		this.uiManager.displayNumber(this.currentNumber);

		// エフェクトを追加
		const numberDisplay = document.getElementById('number-display');
		if (numberDisplay) {
			numberDisplay.classList.add('division-effect');
			setTimeout(() => {
				numberDisplay.classList.remove('division-effect');
			}, 600);
		}

		// 成功メッセージ
		if (validFactors.length === 1) {
			this.createFloatingText(`✅ ÷${validFactors[0]} = ${newNumber}`, 'success');
		} else {
			this.createFloatingText(`✅ ÷(${validFactors.join('×')}) = ${newNumber}`, 'success');
		}

		// 進捗表示を更新
		this.updateProgressDisplay();

		// 1になったかチェック
		if (this.currentNumber === 1) {
			this.onFactorizationComplete();
		}
	}
	/**
	 * 進捗表示を更新
	 */
	updateProgressDisplay() {
		const factorDisplay = document.getElementById('factor-display');
		if (!factorDisplay || this.usedFactors.length === 0) return;

		const factorText = this.usedFactors.join(' × ');

		if (this.currentNumber === 1) {
			// 1になったが、まだ正解かどうかは検証前
			factorDisplay.textContent = `${this.originalNumber} = ${factorText}`;
			factorDisplay.classList.remove('complete', 'correct-answer', 'error');
		} else {
			// 進行中
			factorDisplay.textContent = `${this.originalNumber} ÷ (${factorText}) = ${this.currentNumber}`;
			factorDisplay.classList.remove('complete', 'correct-answer', 'error');
		}

		factorDisplay.style.display = 'block';
		factorDisplay.style.opacity = '1';
		Utils.addTemporaryClass(factorDisplay, 'animate', 500);
	}/**
	 * 因数分解完了時の処理
	 */
	onFactorizationComplete() {
		// 使用した因数が正解と一致するかチェック
		const isCorrect = this.validateFinalAnswer();

		// 進捗表示を更新（完了状態にする前に検証）
		this.updateProgressDisplay();

		if (isCorrect) {
			// 正解の場合
			this.createFloatingText('🎉 因数分解完了！おめでとう！', 'success');
			// 完了スタイルを適用
			const factorDisplay = document.getElementById('factor-display');
			if (factorDisplay) {
				factorDisplay.classList.add('complete');
				factorDisplay.classList.remove('correct-answer');
			}
		} else {
			// 不正解の場合
			this.createFloatingText('❌ 因数分解が正解と一致しません', 'error');
			// 不正解スタイルを適用
			const factorDisplay = document.getElementById('factor-display');
			if (factorDisplay) {
				factorDisplay.classList.remove('complete');
				factorDisplay.classList.add('error');
				factorDisplay.textContent = `❌ ${this.originalNumber} = ${this.usedFactors.join(' × ')} (不正解)`;
			}			// 正解を表示
			setTimeout(() => {
				this.showCorrectAnswer();
			}, 800);
		}		// ボタンを無効化
		this.updatePrimeButtons();
		this.updateSubmitAnswerButton();

		// 自動進行または手動進行
		if (this.autoProgress) {
			// 2秒後に新しい問題を生成
			this.nextProblemTimeout = setTimeout(() => {
				this.createFloatingText('🔄 新しい問題を準備中...', 'info');
				setTimeout(() => {
					this.generatePrimeProduct();
				}, 300);
			}, 2000);
		} else {
			// 手動進行：ユーザーが次の問題ボタンを押すまで待機
			this.createFloatingText('✅ 完了！次の問題ボタンを押してください', 'info');
			this.showNextProblemButton();
		}
	}
	/**
	 * 最終的な解答が正解かどうかを検証
	 * @returns {boolean} 正解かどうか
	 */
	validateFinalAnswer() {
		if (!this.currentResult || !this.usedFactors.length) {
			return false;
		}

		// 使用した因数をソート
		const usedFactorsSorted = [...this.usedFactors].sort((a, b) => a - b);
		// 正解の因数をソート
		const correctFactorsSorted = [...this.currentResult.primes].sort((a, b) => a - b);

		// デバッグ情報をコンソールに出力
		console.log('使用した因数:', usedFactorsSorted);
		console.log('正解の因数:', correctFactorsSorted);
		console.log('元の数字:', this.originalNumber);
		console.log('現在の数字:', this.currentNumber);

		// 配列の長さが違う場合は不正解
		if (usedFactorsSorted.length !== correctFactorsSorted.length) {
			console.log('因数の個数が正解と一致しません');
			return false;
		}

		// 要素を一つずつ比較
		for (let i = 0; i < usedFactorsSorted.length; i++) {
			if (usedFactorsSorted[i] !== correctFactorsSorted[i]) {
				console.log(`因数が一致しません: ${usedFactorsSorted[i]} ≠ ${correctFactorsSorted[i]}`);
				return false;
			}
		}

		console.log('因数分解が正解です！');
		return true;
	}

	/**
	 * 正解を表示
	 */
	showCorrectAnswer() {
		const factorDisplay = document.getElementById('factor-display');
		if (!factorDisplay || !this.currentResult) return;

		const correctFactors = this.currentResult.primes.join(' × ');
		factorDisplay.textContent = `正解: ${this.originalNumber} = ${correctFactors}`;
		factorDisplay.classList.remove('complete');
		factorDisplay.classList.add('correct-answer');
		factorDisplay.style.display = 'block';
		factorDisplay.style.opacity = '1';
	}

	/**
	 * 解答ボタンの表示を更新
	 */
	updateSubmitAnswerButton() {
		const btn = document.getElementById('submit-answer-btn');
		if (btn) {
			const hasSelections = this.selectedFactors.length > 0;
			const isComplete = this.currentNumber === 1;
			const hasNumber = this.currentNumber && this.currentNumber !== null;

			btn.disabled = !hasNumber || !hasSelections || isComplete || this.isShowingAnswer;

			if (isComplete) {
				btn.textContent = '✅ 完了';
			} else if (hasSelections) {
				btn.textContent = `✅ 解答する (${this.selectedFactors.join('×')})`;
			} else {
				btn.textContent = '✅ 解答する';
			}
		}
	}
	/**
	 * クリアボタンの表示を更新
	 */
	updateClearButton() {
		const btn = document.getElementById('clear-selection-btn');
		if (btn) {
			btn.disabled = this.selectedFactors.length === 0 || this.isShowingAnswer || this.currentNumber === 1;
		}
	}

	/**
	 * 次の問題ボタンを表示
	 */
	showNextProblemButton() {
		const generateBtn = document.getElementById('generate-btn');
		if (generateBtn) {
			generateBtn.textContent = '🎲 次の問題を生成';
			generateBtn.disabled = false;
			generateBtn.classList.remove('disabled');
			Utils.addTemporaryClass(generateBtn, 'pulse', 1000);
		}
	}

	/**
	 * 自動進行の切り替え
	 */
	toggleAutoProgress() {
		this.autoProgress = !this.autoProgress;
		
		// 現在のタイマーをクリア
		if (this.nextProblemTimeout) {
			clearTimeout(this.nextProblemTimeout);
			this.nextProblemTimeout = null;
		}

		const message = this.autoProgress ? 
			'🔄 自動進行モードに切り替えました' : 
			'⏸️ 手動進行モードに切り替えました';
		this.createFloatingText(message, 'info');

		// 自動進行モードで、完了状態の場合は即座に次の問題を生成
		if (this.autoProgress && this.currentNumber === 1) {
			setTimeout(() => {
				this.generatePrimeProduct();
			}, 1000);
		}
	}

	/**
	 * 自動進行ボタンの表示を更新
	 */
	updateAutoProgressButton() {
		const autoProgressBtn = document.getElementById('auto-progress-btn');
		if (autoProgressBtn) {
			if (this.autoProgress) {
				autoProgressBtn.textContent = '⏸️ 手動進行に切り替え';
				autoProgressBtn.title = 'Pキーでも切り替え可能';
			} else {
				autoProgressBtn.textContent = '🔄 自動進行に切り替え';
				autoProgressBtn.title = 'Pキーでも切り替え可能';
			}
		}
	}
}
