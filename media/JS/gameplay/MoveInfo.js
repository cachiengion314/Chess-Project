import AssignedVar from "../utility/AssignedVar.js";

export default class MoveInfo {
    constructor(selectedPiece, currentPos, nextPos) {
        this.selectedPiece = selectedPiece;
        this.currentPos = currentPos;
        this.nextPos = nextPos;
        this.capturedScore = null;
        this.preEvaluatedScore = null;
        this.bonusScore = null;
    }
    preEvaluatingCapturedScore(chessBoard, friends_allPossibleMoves) {
        let capturedScore = 0;
        let unexpectedEnemyPiece = chessBoard[this.nextPos.x][this.nextPos.y];
        this.bonusScore = this.nextPos.calculateBonusScore(chessBoard, this.selectedPiece, friends_allPossibleMoves);
        if (unexpectedEnemyPiece) {
            capturedScore += unexpectedEnemyPiece.getWeights();
        } else {
            console.log(`preEvaluatingCapturedScore: unexpectedEnemyPiece null or undifined!`);
        }
        this.capturedScore = capturedScore;

        return this;
    }
}