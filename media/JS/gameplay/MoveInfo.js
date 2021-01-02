import AssignedVar from "../utility/AssignedVar.js";

export default class MoveInfo {
    constructor(selectedPiece, currentPos, nextPos) {
        this.selectedPiece = selectedPiece;
        this.currentPos = currentPos;
        this.nextPos = nextPos;
        this.moveScore = null;
    }
    preEvaluatingMoveScore(chessBoard, friends_allPossibleMoves, enemies_atkPosOnly) {
        let unexpectedEnemyPiece = chessBoard[this.nextPos.x][this.nextPos.y];
        let foundData = this.nextPos.findDangerousPiece(chessBoard, this.selectedPiece, friends_allPossibleMoves, enemies_atkPosOnly);
        this.calculateTradingSituation(unexpectedEnemyPiece, foundData.dangerousEnemies, foundData.protectedFriends);

        return this;
    }
    calculateTradingSituation(unexpectedEnemyPiece, dangerousEnemies, protectedFriends) {
        let tradingValue = 0;
        if (dangerousEnemies.length > 0) {
            dangerousEnemies.sort((objA, objB) => {
                return objA.weights - objB.weights;
            });
            tradingValue -= this.selectedPiece.weights;
            if (protectedFriends.length > 0) {
                protectedFriends.sort((objA, objB) => {
                    return objA.weights - objB.weights;
                });
                tradingValue = 0;
                let gap = dangerousEnemies[0].weights - this.selectedPiece.weights;
                if (gap > 8) gap = 8;
                tradingValue += gap;
            }
        }
        if (unexpectedEnemyPiece.type == AssignedVar.PIECE) {
            tradingValue += unexpectedEnemyPiece.weights;
        }

        this.moveScore = tradingValue;
    }
    calculateBonusPositionScore(clonedChessBoard) {
        let heuristicValue = 0;
        let threatPostionValue = 0;
        let bonusPositionValue = 0;

        let selectedPiece_allPossibleMoves = this.getAllPossibleMoves(clonedChessBoard, this.color);
        for (let pos of selectedPiece_allPossibleMoves) {
            if (pos.isPositionCanAttack(clonedChessBoard, this.color)) {
                if (pos.isPositionHasPiece(clonedChessBoard)) {
                    let enemyPiece = clonedChessBoard[pos.x][pos.y];
                    threatPostionValue += Math.floor(enemyPiece.weights * .1);
                }
            }
            if (bonusPositionValue < 9) {
                bonusPositionValue++;
            }
        }
        heuristicValue = threatPostionValue + bonusPositionValue;
        return heuristicValue;
    }
}