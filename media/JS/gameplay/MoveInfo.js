import AssignedVar from "../utility/AssignedVar.js";

export default class MoveInfo {
    constructor(currentPos, nextPos) {
        this.currentPos = currentPos;
        this.nextPos = nextPos;
        this.heuristicScore = null;
    }

    calculateTradingSituation(selectedPiece, unexpectedEnemyPiece, dangerousEnemies, protectedFriends) {
        let tradingValue = 0;
        if (dangerousEnemies.length > 0) {
            dangerousEnemies.sort((objA, objB) => {
                return objA.weights - objB.weights;
            });
            tradingValue -= selectedPiece.weights;
            if (protectedFriends.length > 0) {
                protectedFriends.sort((objA, objB) => {
                    return objA.weights - objB.weights;
                });
                tradingValue = 0;
                tradingValue += dangerousEnemies[0].weights - selectedPiece.weights;
            }
        }
        if (unexpectedEnemyPiece.type == AssignedVar.PIECE) {
            tradingValue += unexpectedEnemyPiece.weights;
        }

        this.heuristicScore = tradingValue;
    }
}