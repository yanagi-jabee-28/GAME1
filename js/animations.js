/**
 * アニメーション管理クラス
 * UI要素のアニメーション効果を管理
 */
class AnimationManager {
    /**
     * 数字表示のアニメーション
     * @param {HTMLElement} element - アニメーション対象の要素
     */
    static addNumberAnimation(element) {
        element.classList.remove('pulse');
        
        // 少し遅延を入れてからアニメーションを開始
        setTimeout(() => {
            element.classList.add('pulse');
            
            // アニメーション終了後にクラスを削除
            setTimeout(() => {
                element.classList.remove('pulse');
            }, 1000);
        }, 50);
    }
    
    /**
     * フェードインアニメーション
     * @param {HTMLElement} element - アニメーション対象の要素
     */
    static fadeIn(element) {
        element.classList.add('fade-in');
    }
    
    /**
     * ボタンのホバーエフェクト
     * @param {HTMLElement} button - ボタン要素
     */
    static addButtonHoverEffect(button) {
        button.classList.add('hover-effect');
    }
    
    /**
     * 数字の色変更アニメーション
     * @param {HTMLElement} element - 数字表示要素
     * @param {string} color - 新しい色
     */
    static changeNumberColor(element, color) {
        element.style.transition = 'color 0.3s ease';
        element.style.color = color;
    }
}
