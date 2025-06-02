/**
 * 設定管理クラス
 * ゲームの設定値を管理
 */
class GameSettings {
    constructor() {
        this.settings = {
            maxRange: 100,
            speed: 1500,
            autoSave: true
        };
        
        this.loadSettings();
    }
    
    /**
     * 設定を読み込み
     */
    loadSettings() {
        const savedSettings = GameUtils.loadFromStorage('gameSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...savedSettings };
        }
    }
    
    /**
     * 設定を保存
     */
    saveSettings() {
        if (this.settings.autoSave) {
            GameUtils.saveToStorage('gameSettings', this.settings);
        }
    }
    
    /**
     * 数字の範囲を取得
     * @returns {number} 最大範囲
     */
    getMaxRange() {
        return this.settings.maxRange;
    }
    
    /**
     * 数字の範囲を設定
     * @param {number} range - 新しい範囲
     */
    setMaxRange(range) {
        this.settings.maxRange = parseInt(range);
        this.saveSettings();
    }
    
    /**
     * 表示速度を取得
     * @returns {number} 速度（ミリ秒）
     */
    getSpeed() {
        return this.settings.speed;
    }
    
    /**
     * 表示速度を設定
     * @param {number} speed - 新しい速度（ミリ秒）
     */
    setSpeed(speed) {
        this.settings.speed = parseInt(speed);
        this.saveSettings();
    }
    
    /**
     * 自動保存設定を取得
     * @returns {boolean} 自動保存が有効かどうか
     */
    getAutoSave() {
        return this.settings.autoSave;
    }
    
    /**
     * 自動保存設定を変更
     * @param {boolean} enabled - 自動保存を有効にするかどうか
     */
    setAutoSave(enabled) {
        this.settings.autoSave = enabled;
        if (enabled) {
            this.saveSettings();
        }
    }
    
    /**
     * 全設定を取得
     * @returns {object} 設定オブジェクト
     */
    getAllSettings() {
        return { ...this.settings };
    }
    
    /**
     * 設定をリセット
     */
    resetSettings() {
        this.settings = {
            maxRange: 100,
            speed: 1500,
            autoSave: true
        };
        this.saveSettings();
    }
}
