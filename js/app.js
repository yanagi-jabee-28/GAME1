// アプリケーションエントリーポイント
import { NumberGame } from './numberGame.js';
import { PrimeGame } from './primeGame.js';

class App {
    constructor() {
        this.game = null;
        this.gameMode = 'prime'; // デフォルトは素数ゲーム
        this.initialize();
    }

    /**
     * アプリケーションを初期化
     */
    initialize() {
        // DOMContentLoadedイベントを待つ
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    /**
     * アプリケーションを開始
     */
    start() {
        try {
            // ゲームモードに応じて適切なゲームクラスを初期化
            if (this.gameMode === 'prime') {
                this.game = new PrimeGame();
                console.log('素数学習ゲームが開始されました');
            } else {
                this.game = new NumberGame();
                console.log('数字表示ゲームが開始されました');
            }
        } catch (error) {
            console.error('アプリケーションの初期化に失敗しました:', error);
        }
    }

    /**
     * ゲームモードを切り替え
     * @param {string} mode - ゲームモード ('prime' または 'number')
     */
    switchGameMode(mode) {
        this.gameMode = mode;
        this.start();
    }
}

// アプリケーションのインスタンスを作成
const app = new App();
