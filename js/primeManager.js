// 素数管理クラス
import { Utils } from './utils.js';

export class PrimeManager {
    constructor() {        // 各レベルで使用する素数を定義
        this.primesByLevel = {
            1: [2, 3, 5, 7],      // レベル1: 基本素数のみ
            2: [2, 3, 5, 7],      // レベル2: 基本素数のみ（より多くの因数）
            3: [2, 3, 5, 7],      // レベル3: 基本素数のみ（最も多くの因数）
            4: [2, 3, 5, 7, 11, 13],    // レベル4: 11, 13を追加
            5: [2, 3, 5, 7, 11, 13, 17, 19]  // レベル5: 17, 19を追加
        };
          this.currentLevel = 1;
        this.maxDigits = 6;  // 最大6桁まで許可（レベル3で大きな数字を生成するため）
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
    }    /**
     * ランダムな素数を選択
     * @param {number} count - 選択する素数の数（デフォルト：レベルに応じて調整）
     * @returns {Array} 選択された素数の配列
     */
    selectRandomPrimes(count = null) {
        const primes = this.getCurrentPrimes();
        let selectCount;
        
        if (count !== null) {
            selectCount = count;
        } else {            // レベルに応じて素数の選択数を調整
            switch (this.currentLevel) {
                case 1:
                    // レベル1: 2-3個の因数で2桁基本（×1,×10,×100で4桁まで拡張）
                    selectCount = Utils.getRandomInt(2, 3);
                    break;
                case 2:
                    // レベル2: 2-4個の因数で3桁基本（×1,×10で4桁まで拡張）
                    selectCount = Utils.getRandomInt(2, 4);
                    break;
                case 3:
                    // レベル3: 3-5個の因数で4桁まで直接生成
                    selectCount = Utils.getRandomInt(3, 5);
                    break;
                case 4:
                    // レベル4: 3-4個の因数（新しい素数を含む）
                    selectCount = Utils.getRandomInt(3, 4);
                    break;
                case 5:
                    // レベル5: 3-5個の因数（さらに大きな素数を含む）
                    selectCount = Utils.getRandomInt(3, 5);
                    break;
                default:
                    selectCount = Utils.getRandomInt(2, Math.min(3, primes.length));
                    break;
            }
        }
        
        const selected = [];
        const available = [...primes];
        
        // 重複を許可して素数を選択（同じ素数を複数回使用可能）
        for (let i = 0; i < selectCount; i++) {
            const index = Utils.getRandomInt(0, primes.length - 1);
            selected.push(primes[index]);
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
    }    /**
     * レベルに応じた桁数制限で素数の積を生成
     * @returns {Object} {primes: 選択された素数, product: 積}
     */
    generateRandomProduct() {
        let attempts = 0;
        const maxAttempts = 50;
        
        while (attempts < maxAttempts) {
            const primes = this.selectRandomPrimes();
            let product = this.calculateProduct(primes);
            
            // レベル別の桁数制御
            const targetDigits = this.getTargetDigitsForLevel();
            const multiplier = this.getMultiplierForLevel(product);
            
            product = product * multiplier;
            
            // 目標桁数範囲内かチェック
            if (this.isValidProductForLevel(product)) {
                // 実際の因数に乗数を反映（10=2×5, 100=2²×5²）
                const adjustedPrimes = this.adjustPrimesForMultiplier(primes, multiplier);
                return { primes: adjustedPrimes, product };
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
     * レベルに応じた目標桁数を取得
     * @returns {Object} {min: 最小桁数, max: 最大桁数}
     */
    getTargetDigitsForLevel() {
        switch (this.currentLevel) {
            case 1:
                return { min: 2, max: 4 }; // 2桁基本→4桁まで拡張
            case 2:
                return { min: 3, max: 4 }; // 3桁基本→4桁まで拡張
            case 3:
                return { min: 4, max: 4 }; // 4桁固定
            case 4:
                return { min: 3, max: 5 }; // より大きな素数で3-5桁
            case 5:
                return { min: 4, max: 6 }; // 最大の素数で4-6桁
            default:
                return { min: 2, max: 3 };
        }
    }

    /**
     * レベルに応じた乗数を取得
     * @param {number} baseProduct - 基本の積
     * @returns {number} 乗数（1, 10, 100）
     */
    getMultiplierForLevel(baseProduct) {
        const baseDigits = baseProduct.toString().length;
        
        switch (this.currentLevel) {
            case 1:
                // 2桁基本から4桁まで: ×1, ×10, ×100
                if (baseDigits <= 2) {
                    const multipliers = [1, 10, 100];
                    return Utils.getRandomFromArray(multipliers);
                }
                return 1;
            case 2:
                // 3桁基本から4桁まで: ×1, ×10
                if (baseDigits <= 3) {
                    const multipliers = [1, 10];
                    return Utils.getRandomFromArray(multipliers);
                }
                return 1;
            case 3:
            case 4:
            case 5:
                // その他のレベルは乗数なし
                return 1;
            default:
                return 1;
        }
    }

    /**
     * 生成された積がレベルに適しているかチェック
     * @param {number} product - チェックする積
     * @returns {boolean} 適しているかどうか
     */
    isValidProductForLevel(product) {
        const digits = product.toString().length;
        const targetDigits = this.getTargetDigitsForLevel();
        
        return digits >= targetDigits.min && digits <= targetDigits.max;
    }

    /**
     * 乗数に応じて因数配列を調整
     * @param {Array} primes - 元の素数配列
     * @param {number} multiplier - 乗数
     * @returns {Array} 調整された素数配列
     */
    adjustPrimesForMultiplier(primes, multiplier) {
        const adjustedPrimes = [...primes];
        
        if (multiplier === 10) {
            // 10 = 2 × 5
            adjustedPrimes.push(2, 5);
        } else if (multiplier === 100) {
            // 100 = 2² × 5²
            adjustedPrimes.push(2, 2, 5, 5);
        }
        
        return adjustedPrimes.sort((a, b) => a - b);
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
