import AssignedVar from "./AssignedVar.js";
import Vector from "./Vector.js";

export default class Visualize {
    static randomNumberFromAToMax(a, MAX) {
        return Math.floor(Math.random() * (MAX - a)) + a;
    }
    static setupZIndex() {
        $(`.chatbox`).css("z-index", AssignedVar.CHATBOX_ZINDEX);
        $(`#sign-col`).css("z-index", AssignedVar.SIGN_COL_ZINDEX);
        $(`#notification-modal`).css("z-index", AssignedVar.NOTIFICATION_MODAL_ZINDEX);
        $(`.custom-modal`).css("z-index", AssignedVar.CUSTOM_MODAL_ZINDEX);
        $(`#ready-btn`).css("z-index", AssignedVar.READY_BTN_ZINDEX);
        $(`chess-piece`).css("z-index", AssignedVar.CHESS_PIECE_ZINDEX);
        $(`chess-block`).css("z-index", AssignedVar.MIN_BLOCK_ZINDEX);
    }
    static coordinatesNumbers = [8, 7, 6, 5, 4, 3, 2, 1];
    static coordinatesNames = ["a", "b", "c", "d", "e", "f", "g", "h"]
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
        "width": `11%`,
        "height": `11%`,
    }
    static hideAnimate = {
        "opacity": `0`,
    }
    static normalBorderRadiusAnimate = {
        "border-radius": "12%",
    }
    static bigBorderRadiusAnimate = {
        "border-radius": "18%",
    }
    static currentThemeIndex = 0;
    static themes = [{
        "chessboard-bg-color": "mediumpurple",
        "position-block": `chartreuse`,
        "highlight-block": `aqua`,
        "attack-block": `tomato`,
        "dark-block": `mediumspringgreen`,
        "light-block": `gold`,
        "coordinates-color": "blue",
    },
    {
        "chessboard-bg-color": "rosybrown",
        "position-block": "hotpink",
        "highlight-block": "khaki",
        "attack-block": "lime",
        "dark-block": "lightsalmon",
        "light-block": "orangered",
        "coordinates-color": "greenyellow",
    },
    {
        "chessboard-bg-color": "darkblue",
        "position-block": "lightyellow",
        "highlight-block": "lightskyblue",
        "attack-block": "lightsalmon",
        "dark-block": "lightyellow",
        "light-block": "wheat",
        "coordinates-color": "darkslateblue",
    },
    ]
    static logInfo(chessBoard = AssignedVar.currentGame.chessBoard) {
        let str = ``;
        for (let y = 0; y < 8; ++y) {
            for (let x = 0; x < 8; ++x) {
                let block = `${chessBoard[x][y].id}`;
                if (chessBoard[x][y].type == AssignedVar.PIECE) {
                    block = `[${block}]`;
                    if (block.length <= 12) {
                        block = ` ${block} `;
                    }
                } else {
                    block = `[            ]`;
                }
                if (x == 7) {
                    str += ` ${block} \n`;
                } else {
                    str += ` ${block}`;
                }
            }
        }
        console.log(str);
    }

    static chessPieceImageAt(pos) {
        let $chessPiece = Visualize.createWebComponent(AssignedVar.CHESS_PIECE);
        $chessPiece.name = AssignedVar.currentGame.chessBoard[pos.x][pos.y].name;
        $chessPiece.id = AssignedVar.currentGame.chessBoard[pos.x][pos.y].id;
        Visualize.setChessComponentPositionAt(pos, $chessPiece);
    }
    static createWebComponent(componentName) {
        let $cComponent = document.createElement(componentName);
        $(`chess-board`).append($cComponent);
        return $cComponent;
    }
    static setChessComponentPositionAt(pos, $chessComponent) {
        $chessComponent.style.left = pos.convertToPercentPosition().left;
        $chessComponent.style.top = pos.convertToPercentPosition().top;
    }
    static chessBlockImageAt(pos) {
        let $chessBlock = Visualize.createWebComponent(AssignedVar.CHESS_BLOCK);
        Visualize.setNormalColorForBlock($chessBlock, pos);
        if (AssignedVar.currentGame.chessBoard[pos.x][pos.y].type != AssignedVar.PIECE) {
            $chessBlock.id = AssignedVar.currentGame.chessBoard[pos.x][pos.y].id;
        } else {
            $chessBlock.id = AssignedVar.EMPTY + "_" + pos.convertToId();
        }
        Visualize.setChessComponentPositionAt(pos, $chessBlock);
    }
    static queryEmptyBlockAt(pos) {
        return $(`#${AssignedVar.EMPTY}_${pos.convertToId()}`)[0];
    }
    static initCoordinatedNumber() {
        for (let y = 0; y < 8; ++y) {
            let pos = new Vector(0, y);
            let $block = Visualize.queryEmptyBlockAt(pos);
            $block.textContent = Visualize.coordinatesNumbers[y];
            $block.classList.add("font-size-big");
            $block.style.color = Visualize.themes[Visualize.currentThemeIndex][AssignedVar.COORDINATES_COLOR];
            AssignedVar.coordinatesBlocks.push($block);
        }
        for (let x = 0; x < 8; ++x) {
            let pos = new Vector(x, 7);
            let $block = Visualize.queryEmptyBlockAt(pos);
            $block.classList.add("font-size-big");
            $($block).css({
                "display": "flex",
                "justify-content": "flex-end",
                "align-items": "flex-end",
                "color": Visualize.themes[Visualize.currentThemeIndex][AssignedVar.COORDINATES_COLOR],
            });
            $block.textContent = Visualize.coordinatesNames[x];
            AssignedVar.coordinatesBlocks.push($block);
        }
    }
    static movePiece($selectedPiece, currentPos, nextPos) {
        let pushDir = nextPos.plusVector(currentPos.multipliByNumber(-1)).convertToDirection();
        let pushPos = nextPos.plusVector(pushDir.multipliByNumber(.3));
        $(`#${$selectedPiece.id}`).animate({
            "left": pushPos.convertToPercentPosition().left,
            "top": pushPos.convertToPercentPosition().top,
        }, 200);
        $(`#${$selectedPiece.id}`).animate({
            "left": nextPos.convertToPercentPosition().left,
            "top": nextPos.convertToPercentPosition().top,
        }, 100);
    }
    static destroyEnemyPiece($enemyPiece) {
        let currentPos = Vector.convertIdToVector($enemyPiece.id);
        let attackerPos = AssignedVar.selectedPiece.currentPos;
        let pushDirection = currentPos.plusVector(attackerPos.multipliByNumber(-1)).convertToDirection();
        let pushPos = currentPos.plusVector(pushDirection);
        let pushAnimate = {
            ...Visualize.bigAnimate,
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
        $positionBlock.style.backgroundColor = Visualize.themes[Visualize.currentThemeIndex][AssignedVar.POSITION_BLOCK];
        $($positionBlock).animate(Visualize.normalOpacityAnimate, `fast`);

        AssignedVar.selectedPieceSpecialBlocks.push($positionBlock);
        for (let legalMovesPos of AssignedVar.legalMovesOfSelectedPiece) {
            let $highlightBlock = $(`#${AssignedVar.EMPTY + "_" + legalMovesPos.convertToId()}`)[0];
            if (legalMovesPos.isPositionCanAttack() && legalMovesPos.isPositionHasPiece()) {
                $highlightBlock.style.backgroundColor = Visualize.themes[Visualize.currentThemeIndex][AssignedVar.ATTACK_BLOCK];
            } else {
                $highlightBlock.style.backgroundColor = Visualize.themes[Visualize.currentThemeIndex][AssignedVar.HIGHLIGHT_BLOCK];
            }
            $($highlightBlock).animate(Visualize.normalOpacityAnimate, `fast`);

            AssignedVar.selectedPieceSpecialBlocks.push($highlightBlock);
        }
    }
    static removeAllSpecialBlocksFromLastSelectedPiece() {
        for (let block of AssignedVar.selectedPieceSpecialBlocks) {
            $(block).animate(Visualize.paleOpacityAnimate, `fast`);
            let pos = Vector.convertIdToVector(block.id);
            Visualize.setNormalColorForBlock(block, pos);
        }
        AssignedVar.selectedPieceSpecialBlocks.splice(0);
    }
    static onBlockMouseEnterOf($block) {
        $($block).mouseenter(function () {
            let currentPos = Vector.convertIdToVector($block.id);
            let upPos = currentPos.plusVector(new Vector(0, -1).multipliByNumber(.05));
            let effectAnimate = {
                ...Visualize.normalOpacityAnimate,
                ...Visualize.bigBorderRadiusAnimate,
                "left": upPos.convertToPercentPosition().left,
                "top": upPos.convertToPercentPosition().top,
                "z-index": AssignedVar.MAX_BLOCK_ZINDEX,
            };
            $($block).animate(effectAnimate, `fast`);
        });
    }
    static onBlockMouseLeaveOf($block) {
        $($block).mouseleave(function () {
            let currentPos = Vector.convertIdToVector($block.id);
            let normalEffectAnimate = {
                ...Visualize.paleOpacityAnimate,
                ...Visualize.normalBorderRadiusAnimate,
                "left": currentPos.convertToPercentPosition().left,
                "top": currentPos.convertToPercentPosition().top,
                "z-index": AssignedVar.MIN_BLOCK_ZINDEX,
            };
            $($block).animate(normalEffectAnimate, `fast`);
        });
    }
    static onPieceMouseEnterOf($piece) {
        $($piece).mouseenter(function () {
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
        $($piece).mouseleave(function () {
            let currentPos = Vector.convertIdToVector($piece.id);
            let normalEffectAnimate = {
                ...Visualize.normalAnimate,
                "left": currentPos.convertToPercentPosition().left,
                "top": currentPos.convertToPercentPosition().top,
            };
            $($piece).animate(normalEffectAnimate, 100);
        });
    }
    static setNormalColorForBlock($chessBlock, pos) {
        if (pos.isXYUniform()) {
            $chessBlock.style.backgroundColor = Visualize.themes[Visualize.currentThemeIndex][AssignedVar.DARK_BLOCK];
        } else {
            $chessBlock.style.backgroundColor = Visualize.themes[Visualize.currentThemeIndex][AssignedVar.LIGHT_BLOCK];
        }
    }
    static promotePawnEvent($piece, currentPos, color) {
        $piece.classList.remove($piece.name);
        let queenName = AssignedVar.QUEEN_W;
        if (color == AssignedVar.BLACK) {
            queenName = AssignedVar.QUEEN_B;
        }
        $piece.name = queenName;
        $piece.id = queenName + "_" + currentPos.convertToId();
    }
    static setThemeAt(index) {
        if (AssignedVar.IsUserInLobby) {
            return;
        }
        Visualize.currentThemeIndex = index;
        $(`chess-board`)[0].style.backgroundColor = Visualize.themes[index][AssignedVar.CHESSBOARD_BG_COLOR];
        AssignedVar.positionBlock = Visualize.themes[index][AssignedVar.POSITION_BLOCK];
        AssignedVar.highlightBlock = Visualize.themes[index][AssignedVar.HIGHLIGHT_BLOCK];
        AssignedVar.attackBlock = Visualize.themes[index][AssignedVar.ATTACK_BLOCK];
        AssignedVar.darkBlock = Visualize.themes[index][AssignedVar.DARK_BLOCK];
        AssignedVar.lightBlock = Visualize.themes[index][AssignedVar.LIGHT_BLOCK];
        let $chessBlock = $(AssignedVar.CHESS_BLOCK);
        for (let i = 0; i < $chessBlock.length; ++i) {
            let pos = Vector.convertIdToVector($chessBlock[i].id);
            Visualize.setNormalColorForBlock($chessBlock[i], pos);
        }
        for (let i = 0; i < AssignedVar.coordinatesBlocks.length; ++i) {
            AssignedVar.coordinatesBlocks[i].style.color = Visualize.themes[index][AssignedVar.COORDINATES_COLOR];
        }
    }
}