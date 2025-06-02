// アプリケーションエントリーポイント
import { NumberGame } from './numberGame.js';

class App {
    constructor() {
        this.game = null;
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
            this.game = new NumberGame();
            console.log('算数学習ゲームアプリが開始されました');
        } catch (error) {
            console.error('アプリケーションの初期化に失敗しました:', error);
        }
    }
}

// アプリケーションのインスタンスを作成
const app = new App();
