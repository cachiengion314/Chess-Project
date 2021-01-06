import AssignedVar from "../utility/AssignedVar.js";

export default class MoveInfo {
    constructor(selectedPiece, currentPos, nextPos) {
        this.selectedPiece = selectedPiece;
        this.currentPos = currentPos;
        this.nextPos = nextPos;
        this.moveScore = null;
        this.bonusScore = null;
    }
    preEvaluatingMoveScore(chessBoard, friends_allPossibleMoves, enemies_atkPosOnly) {
        let unexpectedEnemyPiece = chessBoard[this.nextPos.x][this.nextPos.y];
        let foundData = this.nextPos.findDangerousPiece(chessBoard, this.selectedPiece, friends_allPossibleMoves, enemies_atkPosOnly);
        this.bonusScore = foundData.bonusScore;
        this.calculateTradingSituation(unexpectedEnemyPiece, foundData.dangerousEnemies, foundData.protectedFriends);

        return this;
    }
    calculateTradingSituation(unexpectedEnemyPiece, dangerousEnemies, protectedFriends) {
        let tradingValue = 0;
        if (dangerousEnemies.length > 0) {
            tradingValue -= this.selectedPiece.weights;
            if (protectedFriends.length > 0) {
                tradingValue = 0;
            }
        }
        if (unexpectedEnemyPiece) {
            tradingValue += unexpectedEnemyPiece.weights;
        } else {
            console.log(`there an error in calculateTradingSituation`);
        }

        this.moveScore = tradingValue;
    }
}