// 素数管理クラス
import { Utils } from './utils.js';

export class PrimeManager {
    constructor() {
        // 各レベルで使用する素数を定義
        this.primesByLevel = {
            1: [2, 3, 5, 7],
            2: [2, 3, 5, 7, 11, 13],
            3: [2, 3, 5, 7, 11, 13, 17, 19],
            4: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
            5: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
        };
        
        this.currentLevel = 1;
        this.maxDigits = 5;
    }

    /**
     * 現在のレベルの素数を取得
     * @returns {Array} 素数の配列
     */
    getCurrentPrimes() {
        return this.primesByLevel[this.currentLevel] || [];
    }

    /**
     * レベルを設定
     * @param {number} level - レベル（1-5）
     */
    setLevel(level) {
        if (level >= 1 && level <= 5) {
            this.currentLevel = level;
        }
    }

    /**
     * 現在のレベルを取得
     * @returns {number} 現在のレベル
     */
    getCurrentLevel() {
        return this.currentLevel;
    }

    /**
     * ランダムな素数を選択
     * @param {number} count - 選択する素数の数（デフォルト：2-4個）
     * @returns {Array} 選択された素数の配列
     */
    selectRandomPrimes(count = null) {
        const primes = this.getCurrentPrimes();
        const selectCount = count || Utils.getRandomInt(2, Math.min(4, primes.length));
        
        const selected = [];
        const available = [...primes];
        
        for (let i = 0; i < selectCount && available.length > 0; i++) {
            const index = Utils.getRandomInt(0, available.length - 1);
            selected.push(available.splice(index, 1)[0]);
        }
        
        return selected.sort((a, b) => a - b);
    }

    /**
     * 素数の積を計算
     * @param {Array} primes - 素数の配列
     * @returns {number} 積
     */
    calculateProduct(primes) {
        return primes.reduce((product, prime) => product * prime, 1);
    }

    /**
     * 最大桁数以下になるように素数を調整して積を計算
     * @returns {Object} {primes: 選択された素数, product: 積}
     */
    generateRandomProduct() {
        let attempts = 0;
        const maxAttempts = 50;
        
        while (attempts < maxAttempts) {
            const primes = this.selectRandomPrimes();
            const product = this.calculateProduct(primes);
            
            // 最大桁数以下かチェック
            if (product.toString().length <= this.maxDigits) {
                return { primes, product };
            }
            
            attempts++;
        }
        
        // フォールバック：レベル1の最小の素数2つ
        const fallbackPrimes = [2, 3];
        return {
            primes: fallbackPrimes,
            product: this.calculateProduct(fallbackPrimes)
        };
    }

    /**
     * 数字が現在のレベルの素数のみで構成されているかチェック
     * @param {number} number - チェックする数字
     * @returns {Object} {isValid: boolean, factors: Array}
     */
    validateNumber(number) {
        const primes = this.getCurrentPrimes();
        const factors = [];
        let remaining = number;
        
        for (const prime of primes) {
            while (remaining % prime === 0) {
                factors.push(prime);
                remaining = remaining / prime;
            }
        }
        
        return {
            isValid: remaining === 1,
            factors: factors.sort((a, b) => a - b)
        };
    }

    /**
     * 利用可能なレベルの一覧を取得
     * @returns {Array} レベル情報の配列
     */
    getLevelInfo() {
        return Object.keys(this.primesByLevel).map(level => ({
            level: parseInt(level),
            primes: this.primesByLevel[level],
            description: `レベル${level} (素数: ${this.primesByLevel[level].join(', ')})`
        }));
    }
}
