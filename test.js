$(document).ready(readyCallback);

function readyCallback() {
    $(`.chess-piece`).animate({
            top: `12.5%`,
            left: `0%`,
        },
        `slow`,
    );
    $(`.chess-piece`).animate({
            top: `12.5%`,
            left: `50%`,
        },
        `slow`,
    );


    $(`.chess-piece`).on(`click`, function(event) {
        if ($(`.hl-block`)) {
            $(`.hl-block`).remove();
        }

        $(`.chess-piece`).animate({
                top: `87.5%`,
                left: `87.5%`,
            },
            `slow`, () => { console.log($(this).position().left / $(`.chess-board`).width() * 100) }
        );
    });
}

function createChessBlock(className) {
    let cBlock = document.createElement(`div`);
    cBlock.className += ` ${className}`;
    $(`.chess-board`).append(cBlock);
}

function setChessBlockPosition($chessBlock, pos) {
    $chessBlock.css({
        top: `${pos.xPos}%`,
        left: `${pos.yPos}%`,
    });
}