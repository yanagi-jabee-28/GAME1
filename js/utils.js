// ユーティリティ関数
export class Utils {
	/**
	 * 指定範囲の整数をランダムに生成
	 * @param {number} min - 最小値
	 * @param {number} max - 最大値
	 * @returns {number} - ランダムな整数
	 */
	static getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * 配列からランダムな要素を選択
	 * @param {Array} array - 配列
	 * @returns {*} - ランダムな要素
	 */
	static getRandomFromArray(array) {
		return array[Math.floor(Math.random() * array.length)];
	}

	/**
	 * 要素にアニメーションクラスを追加し、一定時間後に削除
	 * @param {HTMLElement} element - 対象要素
	 * @param {string} className - アニメーションクラス名
	 * @param {number} duration - 持続時間（ミリ秒）
	 */
	static addTemporaryClass(element, className, duration = 300) {
		element.classList.add(className);
		setTimeout(() => {
			element.classList.remove(className);
		}, duration);
	}

	/**
	 * 数値を3桁区切りでフォーマット
	 * @param {number} num - 数値
	 * @returns {string} - フォーマットされた文字列
	 */
	static formatNumber(num) {
		return num.toLocaleString();
	}
}
