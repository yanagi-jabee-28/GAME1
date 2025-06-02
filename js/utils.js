/**
 * ユーティリティ関数集
 * 汎用的な機能を提供
 */
class GameUtils {
    /**
     * 指定した範囲でランダムな整数を生成
     * @param {number} min - 最小値
     * @param {number} max - 最大値
     * @returns {number} ランダムな整数
     */
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * 数字に応じた色を取得
     * @param {number} number - 数字
     * @param {number} maxRange - 最大範囲
     * @returns {string} カラーコード
     */
    static getNumberColor(number, maxRange) {
        const percentage = number / maxRange;
        
        if (percentage < 0.3) {
            return '#48bb78'; // 緑
        } else if (percentage < 0.7) {
            return '#4299e1'; // 青
        } else {
            return '#ed8936'; // オレンジ
        }
    }
    
    /**
     * ミリ秒を秒に変換して表示用の文字列を生成
     * @param {number} milliseconds - ミリ秒
     * @returns {string} 表示用文字列
     */
    static formatSpeed(milliseconds) {
        const seconds = (milliseconds / 1000).toFixed(1);
        return `${seconds}秒`;
    }
    
    /**
     * ローカルストレージにデータを保存
     * @param {string} key - キー
     * @param {any} value - 値
     */
    static saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('ローカルストレージへの保存に失敗しました:', error);
        }
    }
    
    /**
     * ローカルストレージからデータを取得
     * @param {string} key - キー
     * @param {any} defaultValue - デフォルト値
     * @returns {any} 取得した値
     */
    static loadFromStorage(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.warn('ローカルストレージからの読み込みに失敗しました:', error);
            return defaultValue;
        }
    }
    
    /**
     * デバッグモードかどうかを判定
     * @returns {boolean} デバッグモードかどうか
     */
    static isDebugMode() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.search.includes('debug=true');
    }
    
    /**
     * デバッグログを出力
     * @param {string} message - メッセージ
     * @param {any} data - 追加データ
     */
    static debugLog(message, data = null) {
        if (this.isDebugMode()) {
            console.log(`[Debug] ${message}`, data || '');
        }
    }
}
