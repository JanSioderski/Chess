/*
                VARIABLES
*/
var plateau = document.querySelectorAll("td");
var messDisp = document.getElementById("displayMessage");
var player = document.querySelectorAll("section h2");
var matchSave = document.querySelector("pre");
var tabKQ = [-11, -10, -9, -1, 1, 9, 10, 11];
var tabR = [-10, -1, 1, 10];
var tabB = [-11, -9, 9, 11];
var tabN = [-21, -19, -12, -8, 8, 12, 19, 21];
var turn = "b";
var idThis, cPc, cTarget, thisPc, signe, kId, piece, killedPc, pieces, classNm, isLegal, color;
var cLRook, cLSqr3, cLSqr2, cLSqr1, cSSqr1, cSSqr2, cSRook, startId, endId;
var isWKCheck = false;
var isBKCheck = false;

/*
                FONCTIONS
*/

function removeClassesAll() {
    for (var i = 0; i<64; i++) {
        plateau[i].classList.remove("selectInit", "selectMove", "selectCastle", "selectTarget", "isCheck");
    }
}

function oppCol(color) {
    if (color == "w") {
        return "b";
    } else if (color == "b") {
        return "w";
    } else {
        //alert("problème, color = " + color);
        return color;
    }
}

function isCheck(testedSquare, color) {
    //console.log("isCheck");
    testedSquare.classList.add(color + "ka"); // class name may have been "_k" but we need a valid color as first letter. So I added one letter after.
    var classes = "." + oppCol(color) + "k, ." + oppCol(color) + "q, ." + oppCol(color) + "b, ." 
        + oppCol(color) + "n, ." + oppCol(color) + "r, ." + oppCol(color) + "p";
    pieces = document.querySelectorAll(classes);
    for (var cell of pieces) {
        showAll(cell, true);
    }
    testedSquare.classList.remove(color + "ka");
    return testedSquare.classList.contains("isCheck");
}

function toggleTurn() {
    turn = oppCol(turn);
    console.log("OK " + turn);
    player[0].classList.toggle("yourTurn");
    player[1].classList.toggle("yourTurn");
}

function move(that) {
    //console.log("move");
    killedPc = "";
    if (that.classList.contains("selectTarget")) {
        killedPc = that.classList[0];
    }
    endId = that.id;
    thisPc = document.querySelector(".selectInit");
    startId = thisPc.id;
    piece = thisPc.classList[0];
    if (piece == turn + "k" || piece == turn + "r") {
        thisPc.classList.remove("castleAllowed");
    }
    thisPc.classList.remove(piece);
    that.className = piece;
    removeClassesAll();
    var king = document.querySelector("." + turn + "k");
    if (isCheck(king, turn)) {
        alert("Coup interdit (roi en échec)");
        thisPc.className = piece;
        that.className = killedPc;
        toggleTurn();
        return "crash";
    } 

    //promotion
    if (piece == turn + "p") {
        var rowP = parseInt(that.id) % 10;
        if (rowP == 8 && turn == "w" || rowP == 1 && turn == "b") {
            var promote = promptInTab("En quelle pièce faut-il promouvoir ce pion ?\n"
                + "- Dame (q)\n- Tour (r)\n- Fou (b)\n- Cavalier (n)",['q','r','b','n']);
            that.className = turn + promote;
        }
    }
    //notation
    var change = turn == "w" ? "\n" : " ";
    matchSave.textContent += change + startId + endId;

}

function movePc(that) {
    isLegal = move(that);
    playTurn();
}

function killPc(that){
    //console.log("killPc");
    isLegal = move(that);
    if(!isLegal) {
        var divSelect = "#" + piece.charAt(0) + " div";
        var cemetery = document.querySelector(divSelect);
        cemetery.innerHTML += "<img src=\"img/" + killedPc + ".png\" alt=\"\">";
    }
    playTurn();
}

function castlePc(that){
    //console.log("castlePc");
    isLegal = move(that);
    if (Math.floor(parseInt(that.id) / 10) == 7) { // column n°7
        cSRook.classList.add("selectInit");
        move(cSSqr1);
    } else {
        cLRook.classList.add("selectInit");
        move(cLSqr1);
    }
    playTurn();
}

function isInChessBoard(idPc) {
    return (idPc > 10 && idPc < 89 && (idPc - 1) % 10 < 8);
}

function mayKill(cPc, cTarget) {
    //console.log("mayKill", cPc, cTarget);
    if (cPc.classList[0].charAt(0) == oppCol(cTarget.classList[0].charAt(0))) {
        cTarget.classList.add("selectTarget");
    }
}

function mayCheck(cPc, cTarget) {
    //console.log("mayCheck", cPc, cTarget);
    if (cPc.classList[0].charAt(0) == oppCol(cTarget.classList[0].charAt(0)) && cTarget.classList[0].charAt(1) == "k") {
        cTarget.classList.add("isCheck");
    }
}

function mayKN(idPc, incrementTab, check) {
    //console.log("mayKN");
    cPc = document.getElementById(''+ idPc);
    // roque / castling
    if (
        incrementTab == tabKQ && 
        !check && 
        cPc.classList.contains("castleAllowed") && 
        !isCheck(cPc,turn)
    ) {
        cLRook = document.getElementById(''+ (idPc - 40));
        cLSqr3 = document.getElementById(''+ (idPc - 30));
        cLSqr2 = document.getElementById(''+ (idPc - 20));
        cLSqr1 = document.getElementById(''+ (idPc - 10));
        cSSqr1 = document.getElementById(''+ (idPc + 10));
        cSSqr2 = document.getElementById(''+ (idPc + 20));
        cSRook = document.getElementById(''+ (idPc + 30));
        console.log(cPc, turn, isCheck(cLSqr2,turn), isCheck(cLSqr1,turn), isCheck(cSSqr1,turn), isCheck(cSSqr2,turn));
        // petit roque / castling short
        if (
            cSSqr1.className == ""
            && cSSqr2.className == ""
            && cSRook.classList.contains("castleAllowed")
            && !isCheck(cSSqr1,turn)
            && !isCheck(cSSqr2,turn)
        ) {
            cSSqr2.className = "selectCastle";
        }
        // grand roque / castling long
        if (
            cLSqr1.className == ""
            && cLSqr2.className == ""
            && cLSqr3.className == ""
            && cLRook.classList.contains("castleAllowed")
            && !isCheck(cLSqr1,turn)
            && !isCheck(cLSqr2,turn)
        ) {
            cLSqr2.className = "selectCastle";
        }
    }
    cPc = document.getElementById(''+ idPc);
    var incTbLen = incrementTab.length;
    for (var m = 0; m < incTbLen; m++) {
        kId = idPc + incrementTab[m];
        if (!isInChessBoard(kId)) {continue;}
        cTarget = document.getElementById(''+ kId);
        if (cTarget.className != "") {
            if (check) {
                mayCheck(cPc, cTarget);
            } else {
                mayKill(cPc, cTarget);
            }
        } else if (!check) {
            cTarget.classList.add("selectMove");
        }
    }
}

function mayRBQ(idPc, incrementTab, check) {
    //console.log("mayRBQ");
    cPc = document.getElementById(''+ idPc);
    var incTbLen = incrementTab.length;
    for (var m = 0; m < incTbLen; m++) {
        var k = 0;
        do {
            k++;
            kId = idPc + k*incrementTab[m];
            if (!isInChessBoard(kId)) {break;}
            cTarget = document.getElementById(''+ kId);
            if (cTarget.className != "") {
                if (check) {
                    mayCheck(cPc, cTarget);
                } else {
                    mayKill(cPc, cTarget);
                }
                break;
            } else if (!check) {
                cTarget.classList.add("selectMove");
            }
        } while (k < 8);
    }
}

function mayP(idPc, check) {
    //console.log("mayP");
    cPc = document.getElementById(''+ idPc);
    signe = cPc.classList[0].charAt(0) == "w" ? 1 : -1;
    if (!check) {
        kId = idPc + signe;
        cTarget = document.getElementById(''+ kId);    
        if (cTarget.className == "") {
            cTarget.classList.add("selectMove");
    // 1st movement
            if (idPc % 10 == 2 && signe == 1 || idPc % 10 == 7 && signe == -1) {
                kId = idPc + signe*2;
                cTarget = document.getElementById(''+ kId);    
                if (cTarget.className == "") {
                    cTarget.classList.add("selectMove");
                } 
            }
        }
    }
    // attack
    for (m = -9; m < 12; m += 20) {
        kId = idPc + signe*m;
        if (!isInChessBoard(kId)) {continue;}
        cTarget = document.getElementById(''+ kId);
        if (cTarget.className != "") {
            if (check) {
                mayCheck(cPc, cTarget);
            } else {
                mayKill(cPc, cTarget);
            }
        }
    }
}

function showAll(cPc, check) {
    var check = check || false;
    //console.log("showAll");
    if (!check) { 
        cPc.classList.add("selectInit");
    }
    idThis = parseInt(cPc.id);
    if (cPc.classList.contains("wk") || cPc.classList.contains("bk")) {mayKN(idThis, tabKQ, check);}
    if (cPc.classList.contains("wq") || cPc.classList.contains("bq")) {mayRBQ(idThis, tabKQ, check);}
    if (cPc.classList.contains("wr") || cPc.classList.contains("br")) {mayRBQ(idThis, tabR, check);}
    if (cPc.classList.contains("wb") || cPc.classList.contains("bb")) {mayRBQ(idThis, tabB, check);}
    if (cPc.classList.contains("wn") || cPc.classList.contains("bn")) {mayKN(idThis, tabN, check);}
    if (cPc.classList.contains("wp") || cPc.classList.contains("bp")) {mayP(idThis, check);}
}

function onClickCaseInit() {
    //console.log("onClickCaseInit", this);
    if (this.classList.contains("selectMove")) {
        movePc(this);
    } else if (this.classList.contains("selectCastle")) {
        castlePc(this);
    } else if (this.classList.contains("selectTarget")) {
        killPc(this);
    } else {
        removeClassesAll();
        if (this.className != "") {
            if (this.classList[0].charAt(0) == turn) {
                showAll(this, false);
            }
        }
    }
}

function playTurn() {
    //console.log("playTurn");
    if(document.querySelector(".wk") != null && document.querySelector(".bk") != null) {
        toggleTurn();
        for (var i = 0; i<64; i++) {
            plateau[i].addEventListener('click', onClickCaseInit); 
        }
    } else {
        messDisp.textContent = "Fin de partie !!";
    }
}

/*
                APPLICATION
*/

playTurn();