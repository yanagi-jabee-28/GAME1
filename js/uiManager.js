// UI管理クラス
import { Utils } from './utils.js';

export class UIManager {
	constructor() {
		this.elements = {};
		this.initializeElements();
	}

	/**
	 * DOM要素を初期化
	 */
	initializeElements() {
		this.elements.numberDisplay = document.getElementById('number-display');
		this.elements.generateBtn = document.getElementById('generate-btn');
		this.elements.historyBtn = document.getElementById('history-btn');
		this.elements.settingsBtn = document.getElementById('settings-btn');
		this.elements.historyList = document.getElementById('history-list');

		// 素数ゲーム用の要素
		this.elements.levelSelect = document.getElementById('level-select');
		this.elements.currentLevel = document.getElementById('current-level');
		this.elements.primeButtons = document.getElementById('prime-buttons');
		this.elements.factorDisplay = document.getElementById('factor-display');
		this.elements.showFactorsBtn = document.getElementById('show-factors-btn');
	}

	/**
	 * 数字を表示
	 * @param {number} number - 表示する数字
	 */
	displayNumber(number) {
		if (this.elements.numberDisplay) {
			this.elements.numberDisplay.textContent = Utils.formatNumber(number);
			Utils.addTemporaryClass(this.elements.numberDisplay, 'animate', 500);
		}
	}

	/**
	 * プレースホルダーを表示
	 * @param {string} text - プレースホルダーテキスト
	 */
	displayPlaceholder(text = '?') {
		if (this.elements.numberDisplay) {
			this.elements.numberDisplay.textContent = text;
		}
	}

	/**
	 * 履歴を表示
	 * @param {Array} history - 履歴配列
	 */
	displayHistory(history) {
		if (this.elements.historyList) {
			this.elements.historyList.innerHTML = '';
			if (history.length === 0) {
				this.elements.historyList.innerHTML = '<li>履歴がありません</li>';
				return;
			}

			history.forEach((number, index) => {
				const li = document.createElement('li');
				li.textContent = `${index + 1}. ${Utils.formatNumber(number)}`;
				li.style.animationDelay = `${index * 0.1}s`;
				this.elements.historyList.appendChild(li);
			});
		}
	}

	/**
	 * ボタンの有効/無効を切り替え
	 * @param {string} buttonId - ボタンID
	 * @param {boolean} enabled - 有効かどうか
	 */
	toggleButton(buttonId, enabled) {
		const button = document.getElementById(buttonId);
		if (button) {
			button.disabled = !enabled;
		}
	}

	/**
	 * 要素の表示/非表示を切り替え
	 * @param {string} elementId - 要素ID
	 * @param {boolean} visible - 表示するかどうか
	 */
	toggleVisibility(elementId, visible) {
		const element = document.getElementById(elementId);
		if (element) {
			element.style.display = visible ? 'block' : 'none';
		}
	}

	/**
	 * レベル選択のオプションを生成
	 * @param {Array} levelInfo - レベル情報の配列
	 */
	populateLevelSelect(levelInfo) {
		if (this.elements.levelSelect) {
			this.elements.levelSelect.innerHTML = '';
			levelInfo.forEach(info => {
				const option = document.createElement('option');
				option.value = info.level;
				option.textContent = `レベル ${info.level}`;
				this.elements.levelSelect.appendChild(option);
			});
		}
	}

	/**
	 * 数字と因数分解を同時に表示
	 * @param {number} number - 表示する数字
	 * @param {Array} factors - 因数の配列（オプション）
	 */
	displayNumberWithFactors(number, factors = null) {
		this.displayNumber(number);

		if (factors && this.elements.factorDisplay) {
			const factorText = factors.join(' × ');
			this.elements.factorDisplay.textContent = `= ${factorText}`;
			this.elements.factorDisplay.style.display = 'block';
			this.elements.factorDisplay.style.opacity = '1';
			Utils.addTemporaryClass(this.elements.factorDisplay, 'animate', 500);
		}
	}
}
