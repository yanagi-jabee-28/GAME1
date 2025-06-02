/**
 * 算数ゲーム基底クラス
 * 将来的な算数ゲーム（足し算、引き算、掛け算など）の基盤
 */
class MathGame {
    constructor(gameType) {
        this.gameType = gameType;
        this.score = 0;
        this.questions = [];
        this.currentQuestion = null;
        this.timeLimit = 30; // 秒
        this.isGameActive = false;
    }
    
    /**
     * ゲームを開始
     */
    startGame() {
        this.isGameActive = true;
        this.score = 0;
        this.generateQuestion();
    }
    
    /**
     * ゲームを停止
     */
    stopGame() {
        this.isGameActive = false;
    }
    
    /**
     * 問題を生成（サブクラスでオーバーライド）
     */
    generateQuestion() {
        throw new Error('generateQuestion method must be implemented by subclass');
    }
    
    /**
     * 回答をチェック
     * @param {number} answer - ユーザーの回答
     * @returns {boolean} 正解かどうか
     */
    checkAnswer(answer) {
        if (!this.currentQuestion) return false;
        
        const isCorrect = answer === this.currentQuestion.answer;
        if (isCorrect) {
            this.score += this.currentQuestion.points || 10;
        }
        
        return isCorrect;
    }
    
    /**
     * スコアを取得
     * @returns {number} 現在のスコア
     */
    getScore() {
        return this.score;
    }
    
    /**
     * ゲーム統計を取得
     * @returns {object} 統計情報
     */
    getStats() {
        return {
            gameType: this.gameType,
            score: this.score,
            isActive: this.isGameActive,
            timeLimit: this.timeLimit
        };
    }
}

/**
 * 足し算ゲームクラス（将来実装予定）
 */
class AdditionGame extends MathGame {
    constructor() {
        super('addition');
        this.maxNumber = 10;
    }
    
    generateQuestion() {
        const num1 = GameUtils.getRandomInt(1, this.maxNumber);
        const num2 = GameUtils.getRandomInt(1, this.maxNumber);
        
        this.currentQuestion = {
            text: `${num1} + ${num2} = ?`,
            answer: num1 + num2,
            points: 10
        };
        
        return this.currentQuestion;
    }
}

/**
 * 引き算ゲームクラス（将来実装予定）
 */
class SubtractionGame extends MathGame {
    constructor() {
        super('subtraction');
        this.maxNumber = 20;
    }
    
    generateQuestion() {
        const num1 = GameUtils.getRandomInt(5, this.maxNumber);
        const num2 = GameUtils.getRandomInt(1, num1); // 答えが負にならないように
        
        this.currentQuestion = {
            text: `${num1} - ${num2} = ?`,
            answer: num1 - num2,
            points: 15
        };
        
        return this.currentQuestion;
    }
}

/**
 * 掛け算ゲームクラス（将来実装予定）
 */
class MultiplicationGame extends MathGame {
    constructor() {
        super('multiplication');
        this.maxNumber = 10;
    }
    
    generateQuestion() {
        const num1 = GameUtils.getRandomInt(1, this.maxNumber);
        const num2 = GameUtils.getRandomInt(1, this.maxNumber);
        
        this.currentQuestion = {
            text: `${num1} × ${num2} = ?`,
            answer: num1 * num2,
            points: 20
        };
        
        return this.currentQuestion;
    }
}
