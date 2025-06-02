// 数字生成器クラス
import { Utils } from './utils.js';

export class NumberGenerator {
    constructor(options = {}) {
        this.minValue = options.minValue || 1;
        this.maxValue = options.maxValue || 100;
        this.currentNumber = null;
        this.history = [];
        this.maxHistory = options.maxHistory || 10;
    }

    /**
     * ランダムな数字を生成
     * @returns {number} - 生成された数字
     */
    generate() {
        this.currentNumber = Utils.getRandomInt(this.minValue, this.maxValue);
        this.addToHistory(this.currentNumber);
        return this.currentNumber;
    }

    /**
     * 履歴に数字を追加
     * @param {number} number - 追加する数字
     */
    addToHistory(number) {
        this.history.unshift(number);
        if (this.history.length > this.maxHistory) {
            this.history.pop();
        }
    }

    /**
     * 現在の数字を取得
     * @returns {number} - 現在の数字
     */
    getCurrentNumber() {
        return this.currentNumber;
    }

    /**
     * 履歴を取得
     * @returns {Array} - 数字の履歴
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * 範囲を設定
     * @param {number} min - 最小値
     * @param {number} max - 最大値
     */
    setRange(min, max) {
        this.minValue = min;
        this.maxValue = max;
    }

    /**
     * 設定をリセット
     */
    reset() {
        this.currentNumber = null;
        this.history = [];
    }
}
