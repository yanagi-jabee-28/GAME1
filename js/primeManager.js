// 素数管理クラス
import { Utils } from './utils.js';

export class PrimeManager {    constructor() {
        // 各レベルで使用する素数を定義
        this.primesByLevel = {
            1: [2, 3, 5, 7, 11],  // レベル1を拡張：11を追加してより多様な組み合わせ
            2: [2, 3, 5, 7, 11, 13],
            3: [2, 3, 5, 7, 11, 13, 17, 19],
            4: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
            5: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
        };
        
        // レベル別の素数選択設定
        this.levelConfig = {
            1: { minPrimes: 2, maxPrimes: 4, allowDuplicates: true },  // 重複許可でより複雑に
            2: { minPrimes: 2, maxPrimes: 4, allowDuplicates: false },
            3: { minPrimes: 2, maxPrimes: 5, allowDuplicates: false },
            4: { minPrimes: 3, maxPrimes: 5, allowDuplicates: false },
            5: { minPrimes: 3, maxPrimes: 6, allowDuplicates: false }
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
    }    /**
     * ランダムな素数を選択
     * @param {number} count - 選択する素数の数（デフォルト：レベル設定による）
     * @returns {Array} 選択された素数の配列
     */
    selectRandomPrimes(count = null) {
        const primes = this.getCurrentPrimes();
        const config = this.levelConfig[this.currentLevel];
        
        // 選択する素数の数を決定
        const selectCount = count || Utils.getRandomInt(config.minPrimes, Math.min(config.maxPrimes, primes.length));
        
        const selected = [];
        
        if (config.allowDuplicates && this.currentLevel === 1) {
            // レベル1では重複を許可してより複雑な組み合わせを作成
            for (let i = 0; i < selectCount; i++) {
                const randomPrime = primes[Utils.getRandomInt(0, primes.length - 1)];
                selected.push(randomPrime);
            }
        } else {
            // 他のレベルでは重複なし
            const available = [...primes];
            for (let i = 0; i < selectCount && available.length > 0; i++) {
                const index = Utils.getRandomInt(0, available.length - 1);
                selected.push(available.splice(index, 1)[0]);
            }
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
     * 最大桁数以下になるように素数を調整して積を計算
     * @returns {Object} {primes: 選択された素数, product: 積}
     */
    generateRandomProduct() {
        // レベル1の場合、特別な楽しいパターンを追加
        if (this.currentLevel === 1) {
            return this.generateLevel1SpecialProduct();
        }
        
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
        
        // レベル別フォールバック
        const fallbackPrimes = this.currentLevel === 1 ? [2, 3] : [2, 3];
        return {
            primes: fallbackPrimes,
            product: this.calculateProduct(fallbackPrimes)
        };
    }

    /**
     * レベル1専用の楽しい数字生成
     * @returns {Object} {primes: 選択された素数, product: 積}
     */
    generateLevel1SpecialProduct() {
        const specialPatterns = [
            // 同じ素数の重複パターン（面白い数字を作る）
            [2, 2, 2],          // 8
            [2, 2, 3],          // 12
            [2, 2, 5],          // 20
            [2, 2, 7],          // 28
            [3, 3, 3],          // 27
            [3, 3, 5],          // 45
            [3, 3, 7],          // 63
            [5, 5, 2],          // 50
            [7, 7, 2],          // 98
            
            // 興味深い組み合わせ
            [2, 3, 5, 7],       // 210
            [2, 3, 11],         // 66
            [2, 5, 11],         // 110
            [3, 5, 7],          // 105
            [3, 7, 11],         // 231
            [5, 7, 11],         // 385
            [2, 2, 3, 5],       // 60
            [2, 2, 3, 7],       // 84
            [2, 3, 3, 5],       // 90
            [2, 3, 5, 5],       // 150
            
            // 大きめの数字（4桁台）
            [2, 2, 2, 3, 5, 7], // 840
            [2, 3, 5, 7, 11],   // 2310 (5桁なのでフィルタリングされる)
            [3, 5, 7, 11],      // 1155
            [2, 2, 5, 7, 11],   // 1540
            [2, 3, 3, 7, 11],   // 1386
        ];
        
        // 5桁以下のパターンのみフィルタリング
        const validPatterns = specialPatterns.filter(pattern => {
            const product = this.calculateProduct(pattern);
            return product.toString().length <= this.maxDigits;
        });
        
        // 20%の確率で特別パターン、80%の確率で通常のランダム生成
        if (Math.random() < 0.4 && validPatterns.length > 0) {
            const selectedPattern = validPatterns[Utils.getRandomInt(0, validPatterns.length - 1)];
            return {
                primes: [...selectedPattern], // コピーして返す
                product: this.calculateProduct(selectedPattern)
            };
        } else {
            // 通常のランダム生成（重複あり）
            const primes = this.selectRandomPrimes();
            return {
                primes,
                product: this.calculateProduct(primes)
            };
        }
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
