import AssignedVar from "./AssignedVar.js";
import Vector from "./Vector.js";

export default class Visualize {
    static randomNumberFromAToMax(a, max) {
        return Math.floor(Math.random() * (max - a)) + a;
    }
    static paleOpacityAnimate = {
        "opacity": `.7`,
    }
    static normalOpacityAnimate = {
        "opacity": `1`,
    }
    static normalAnimate = {
        "width": `12.5%`,
        "height": `12.5%`,
    }
    static bigAnimate = {
        "width": `15%`,
        "height": `15%`,
    }
    static veryBigAnimate = {
        "width": `19%`,
        "height": `19%`,
    }
    static smallAnimate = {
        "width": `12%`,
        "height": `12%`,
    }
    static hideAnimate = {
        "width": `hide`,
        "height": `hide`,
    }
    static normalBorderRadiusAnimate = {
        "border-radius": "9px",
    }
    static bigBorderRadiusAnimate = {
        "border-radius": "18px",
    }
    static logInfo() {
        console.log(`------------------------------`);
        let str = ``;
        for (let y = 0; y < 8; ++y) {
            for (let x = 0; x < 8; ++x) {
                let block = `${AssignedVar.chessBoard[x][y].id}`;
                if (AssignedVar.chessBoard[x][y].type == AssignedVar.PIECE) {
                    block = `[${block}]`;
                } else {
                    block = `[           ]`;
                }
                if (x == 7) {
                    str += ` ${block} \n`;
                } else {
                    str += ` ${block}`;
                }
            }
        }
        console.log(str);
        console.log(`blackPlayer:`, AssignedVar.blackPlayer);
        console.log(`whitePlayer:`, AssignedVar.whitePlayer);
    }
    static chessPieceImageAt(pos) {
        let $chessPiece = Visualize.createChessComponent(AssignedVar.CHESS_PIECE);
        $chessPiece.name = AssignedVar.chessBoard[pos.x][pos.y].name;
        $chessPiece.id = AssignedVar.chessBoard[pos.x][pos.y].id;
        Visualize.setChessComponentPositionAt(pos, $chessPiece);
    }
    static createChessComponent(componentName) {
        let $cComponent = document.createElement(componentName);
        $(`.chess-board`).append($cComponent);
        return $cComponent;
    }
    static setChessComponentPositionAt(pos, $chessComponent) {
        $chessComponent.style.left = pos.convertToPercentPosition().left;
        $chessComponent.style.top = pos.convertToPercentPosition().top;
    }
    static chessBlockImageAt(pos) {
        let $specialBlock = Visualize.createChessComponent(AssignedVar.SPECIAL_BLOCK);
        if (pos.isXYUniform()) {
            $specialBlock.blocktype = AssignedVar.VISUALIZE_BLOCK_EVEN;
        } else {
            $specialBlock.blocktype = AssignedVar.VISUALIZE_BLOCK_ODD;
        }
        if (AssignedVar.chessBoard[pos.x][pos.y].type != AssignedVar.PIECE) {
            $specialBlock.id = AssignedVar.chessBoard[pos.x][pos.y].id;
        } else {
            $specialBlock.id = AssignedVar.EMPTY + "_" + pos.convertToId();
        }
        Visualize.setChessComponentPositionAt(pos, $specialBlock);
    }
    static movePiece($selectedPiece, nextPos) {
        $(`#${$selectedPiece.id}`).animate({
            "left": nextPos.convertToPercentPosition().left,
            "top": nextPos.convertToPercentPosition().top,
        }, `fast`);
    }
    static destroyEnemyPiece($enemyPiece) {
        let currentPos = Vector.convertIdToVector($enemyPiece.id);
        let attackerPos = AssignedVar.selectedPiece.currentPos;
        let pushDirection = currentPos.plusVector(attackerPos.multipliByNumber(-1)).convertToDirection();
        let pushPos = currentPos.plusVector(pushDirection);
        let pushAnimate = {
            width: `15%`,
            height: `15%`,
            left: pushPos.convertToPercentPosition().left,
            top: pushPos.convertToPercentPosition().top,
        };

        $($enemyPiece).animate(pushAnimate, `fast`);
        $($enemyPiece).animate(Visualize.hideAnimate, `fast`, () => { $enemyPiece.remove(); });
    }
    static cannotAttackPieceEffect($chessPiece) {
        let mls = 100;
        $($chessPiece).animate(Visualize.veryBigAnimate, mls);
        $($chessPiece).animate(Visualize.smallAnimate, mls);
        $($chessPiece).animate(Visualize.bigAnimate, mls);
        $($chessPiece).animate(Visualize.normalAnimate, mls);
    }
    static selectedPieceEffectAt(pos) {
        let $positionBlock = $(`#${AssignedVar.EMPTY + "_" + pos.convertToId()}`)[0];
        $positionBlock.blocktype = AssignedVar.POSITION_BLOCK;
        $($positionBlock).animate(Visualize.normalOpacityAnimate, `fast`);

        AssignedVar.selectedPieceSpecialBlocks.push($positionBlock);
        for (let legalMovesPos of AssignedVar.legalMovesOfSelectedPiece) {
            let $highlightBlock = $(`#${AssignedVar.EMPTY + "_" + legalMovesPos.convertToId()}`)[0];
            $highlightBlock.blocktype = AssignedVar.HIGHLIGHT_BLOCK;
            $($highlightBlock).animate(Visualize.normalOpacityAnimate, `fast`);

            AssignedVar.selectedPieceSpecialBlocks.push($highlightBlock);
        }
    }
    static removeAllSpecialBlocksFromLastSelectedPiece() {
        for (let block of AssignedVar.selectedPieceSpecialBlocks) {
            $(block).animate(Visualize.paleOpacityAnimate, `fast`);
            let pos = Vector.convertIdToVector(block.id);
            if (pos.isXYUniform()) {
                block.blocktype = AssignedVar.VISUALIZE_BLOCK_EVEN;
            } else {
                block.blocktype = AssignedVar.VISUALIZE_BLOCK_ODD;
            }
        }
        AssignedVar.selectedPieceSpecialBlocks.splice(0);
    }
    static onBlockMouseEnterOf($block) {
        $($block).mouseenter(function() {
            let currentPos = Vector.convertIdToVector($block.id);
            let upPos = currentPos.plusVector(new Vector(0, -1).multipliByNumber(.07));
            let effectAnimate = {
                ...Visualize.normalOpacityAnimate,
                ...Visualize.bigBorderRadiusAnimate,
                "left": upPos.convertToPercentPosition().left,
                "top": upPos.convertToPercentPosition().top,
                "z-index": `3`,
            };
            $($block).animate(effectAnimate, `fast`);
        });
    }
    static onBlockMouseLeaveOf($block) {
        $($block).mouseleave(function() {
            let currentPos = Vector.convertIdToVector($block.id);
            let normalEffectAnimate = {
                ...Visualize.paleOpacityAnimate,
                ...Visualize.normalBorderRadiusAnimate,
                "left": currentPos.convertToPercentPosition().left,
                "top": currentPos.convertToPercentPosition().top,
                "z-index": "2",
            };
            $($block).animate(normalEffectAnimate, `fast`);
        });
    }
    static onPieceMouseEnterOf($piece) {
        $($piece).mouseenter(function() {
            let currentPos = Vector.convertIdToVector($piece.id);
            let upPos = currentPos.plusVector(new Vector(0, -1).multipliByNumber(.07));
            let effectAnimate = {
                ...Visualize.bigAnimate,
                "left": upPos.convertToPercentPosition().left,
                "top": upPos.convertToPercentPosition().top,
            };
            $($piece).animate(effectAnimate, 50);
        });
    }
    static onPieceMouseLeaveOf($piece) {
        $($piece).mouseleave(function() {
            let currentPos = Vector.convertIdToVector($piece.id);
            let normalEffectAnimate = {
                ...Visualize.normalAnimate,
                "left": currentPos.convertToPercentPosition().left,
                "top": currentPos.convertToPercentPosition().top,
            };
            $($piece).animate(normalEffectAnimate, 100);
        });
    }
}