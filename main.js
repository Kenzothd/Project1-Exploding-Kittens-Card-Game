import $ from "jquery";
import "sanitize.css";

// console.log($);

///////////////////STATE///////////////////////
const app = {
  page: "#game",
  instructpage: ["#one", "#two", "#three"],
};

class Card {
  //This is for when I want to pass new type of cards in
  constructor(name, text, isUsed) {
    this.name = name;
    this.text = text;
    this.isUsed = isUsed;
  }
}

class DeckToIssue {
  constructor() {
    this.issuingDeck = [];
    this.fiveStarterCards = [];
  }

  //Create new type of cards(without the expoding kittens and defuse) and push it in the array this.issuingDeck
  createIssuingDeck() {
    let name = [
      "Attack🗡",
      "Skip⏭",
      "Favor🖤",
      "Shuffle🔀",
      "Potato Cat🥔",
      "Beard Cat🧔🏼‍♀️",
      "Taco Cat🌮",
      "Catermelon🍉",
      "RainbowCat🌈",
      "See The Future👀",
      "Nope🙅🏼",
      "Defuse🛠",
    ];
    let text = [
      "End your turn without drawing a card. Force the next player to take two turns. ",
      "End your turn without drawing a card.",
      "One player must give you a card of their choice",
      "Shuffle the draw pile.",
      "This is a cat card and is powerless on its own. Play two tacocats as a pair to steal a random card from another player.",
      "This is a cat card and is powerless on its own. Play two tacocats as a pair to steal a random card from another player.",
      "This is a cat card and is powerless on its own. Play two tacocats as a pair to steal a random card from another player.",
      "This is a cat card and is powerless on its own. Play two tacocats as a pair to steal a random card from another player.",
      "This is a cat card and is powerless on its own. Play two tacocats as a pair to steal a random card from another player.",
      "Privately view the top three cards of the draw pile",
      "Stop the action of another player. You can play this at any time.",
      "Use upon drawing the exploding kittens. Secretly put the exploding kitten card back to the draw pile.",
    ];
    let isUsed = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ];
    for (let i = 0; i < name.length; i++) {
      for (let j = 0; j < 2; j++) {
        //loop thru the objects two times and create an issuing deck
        this.issuingDeck.push(new Card(name[i], text[i], isUsed[i]));
      }
    }
  }

  shuffleDeck() {
    for (let i = this.issuingDeck.length - 1; i > 0; i--) {
      //generate a random number from 0 to issuingDeck.length
      let randomIndex = Math.floor(Math.random() * (i + 1));
      let temp = this.issuingDeck[i];
      this.issuingDeck[i] = this.issuingDeck[randomIndex];
      this.issuingDeck[randomIndex] = temp;
    }
  }

  addExplodingKittensCard() {
    //this function will push the exploding kittens to the issuing Deck
    this.issuingDeck.push(
      new Card("Exploding Kittens💣😹", "You exploded!🤯", false)
    );
  }

  explodingKittensCard() {
    //this will create an exploding kittens card
    new Card("Exploding Kittens💣😹", "You exploded!🤯", false);
  }

  addDefuseCard() {
    //this function will push the defuse card int the fiveStarterCards array
    this.fiveStarterCards.push(
      new Card(
        "Defuse🛠",
        "Use upon drawing the exploding kittens. Secretly put the exploding kitten card back to the draw pile.",
        false
      )
    );
  }

  issueFiveCards() {
    //pick 4 cards from the top as it loops down
    const iDLength = this.issuingDeck.length;
    //create empty array and push 4 cards from issuing deck into it while also removing the 4 cards from it
    const arr = [];
    for (let i = iDLength - 1; i >= iDLength - 4; i--) {
      arr.push(this.issuingDeck[i]);
      this.issuingDeck.pop();
    }
    // replace this 4 cards to the fiveStarterCards array
    this.fiveStarterCards = arr;
    // make a defuse card and push it in the same array
    this.addDefuseCard();
  }
}

class Player {
  constructor(name) {
    this.playerName = name;
    this.playerCards = [];
  }
}

class Board {
  constructor() {
    this.players = [];
    this.drawPile = [];
    this.discardPile = [];
    this.playerTurns = "";
  }
  start(playerOneName, playerTwoName) {
    //1)create players
    this.players.push(new Player(playerOneName));
    this.players.push(new Player(playerTwoName));

    //reflects player name
    const $playeronename = $("#playeronename");
    $playeronename.text(this.players[0].playerName);
    const $playertwoname = $("#playertwoname");
    $playertwoname.text(this.players[1].playerName);

    //2)create issuing deck of cards without the exploding kittens then shuffle it
    const iD = new DeckToIssue();
    iD.createIssuingDeck();
    iD.shuffleDeck();

    //3)issue the initial deck of cards by passing/storing 5 cards each to different playersCards array
    iD.issueFiveCards();
    this.players[0].playerCards = iD.fiveStarterCards;

    iD.issueFiveCards(); //invoking a second time will cause the first fiveStarterCards to be replaced with a new set of 5 cards
    this.players[1].playerCards = iD.fiveStarterCards;

    //4)Add back the exploding kittens into the deck, shuffle  and store it in the draw pile
    iD.addExplodingKittensCard();
    iD.shuffleDeck();
    // iD.addExplodingKittensCard(); //!!!!remove once done this add the exploding to the top of the deck
    // iD.addExplodingKittensCard(); //!!!!remove once done this add the exploding to the top of the deck
    this.drawPile.push(iD.issuingDeck);

    //Display all cards to board
    this.renderBoard();

    //5) Player advantage, player will start first
    this.playerTurns = true;
    $("#playeronename").toggleClass("backlight");
    console.log(this.drawPile[0]);
  }

  draw(player) {
    const drawPile = this.drawPile[0];
    //check top card of the drawpile
    this.checkExplode(drawPile[drawPile.length - 1], player);
    // push top(last) card from drawpile to playercards array
    player.playerCards.push(drawPile[drawPile.length - 1]);
    // remove last(top) card from drawpile
    drawPile.splice([drawPile.length - 1], 1);
    // Reflect all to the board
    this.renderBoard();
    renderPlayerTurn();
  }

  checkExplode(cardDrawn, player) {
    if (cardDrawn.name === "Exploding Kittens💣😹") {
      //render backlight back to player
      renderPlayerTurn();
      //disable onclick on draw btn
      $("#btndraw").attr("disabled", "disabled");
      //loop thru playerCards array and find for defuse card
      const findDefuseIndex = player.playerCards.findIndex(
        (element) => element.name === "Defuse🛠"
      );
      if (findDefuseIndex < 0) {
        //if no defuse card
        promptTwo(`No defuse card, ${player.playerName} Lose!🥲`);
        //add a div to the prompt div
        $("#prompttwo").append(
          $("<button>").attr("id", "btnprompttwo").text("Done")
        );
        //refresh page on click
        $("#btnprompttwo").on("click", () => {
          location.reload(true);
        });
        $("#prompttwo").append($("<h3>").text("Click 'done' to restart!"));
      } else {
        //if have defuse card, //*DEFUSE FUNCTION*//
        prompt(`${player.playerName} Exploded!🤯 Use defuse card?`);

        $("#yes").on("click", () => {
          //remove prompt statement
          $("#prompt").remove();
          //1)Add exploding card back to drawpile randomly
          const randomIndex = Math.floor(
            Math.random() * this.drawPile[0].length
          );
          this.drawPile[0].splice(randomIndex, 0, cardDrawn);

          //2)Remove exploding card from player hand
          player.playerCards.pop();

          //3)Add used defuse card to discard pile
          this.discardPile.push(player.playerCards[findDefuseIndex]);

          //4)Remove defuse card from player hand
          player.playerCards.splice(findDefuseIndex, 1);

          //Reflect all cards on board
          this.renderBoard();

          //enable draw btn again
          $("#btndraw").removeAttr("disabled", "disabled");

          //Prompt defused!
          promptTwo("Bomb have been defused!😮‍💨");

          //add a div to the prompt div
          $("#prompttwo").append(
            $("<button>").attr("id", "btnprompttwo").text("Done")
          );
          $("#btnprompttwo").on("click", () => {
            $("#prompttwo").remove();
          });

          renderPlayerTurn();
        });
        $("#no").on("click", () => {
          //remove prompt statement
          $("#prompt").remove();
          promptTwo(`${player.playerName} Lose!🥲`);
          //add a div to the prompt div
          $("#prompttwo").append(
            $("<button>").attr("id", "btnprompttwo").text("Done")
          );
          //refresh page on click
          $("#btnprompttwo").on("click", () => {
            location.reload(true);
          });
          $("#prompttwo").append($("<h3>").text("Click 'done' to restart!"));
        });
      }
    } else {
      console.log("not yet"); //indicate if its not exploding card being drawn, off later
    }
  }

  //*check turn --> player draw --> reflects card --> switch player
  checkTurn() {
    if (this.playerTurns === true) {
      console.log(this.players[1]);
      this.draw(this.players[0]);
      this.renderBoard();
      this.playerTurns = false;
      console.log(this.playerTurns);
      // $("#btndraw").attr("disabled", "disabled");
      // this.checkTurn(); //com currently no logic, hence will draw to end turn
    } else {
      console.log(this.players[1]);
      this.draw(this.players[1]);
      this.renderBoard();
      this.playerTurns = true;
      console.log(this.playerTurns);
      // $("#btndraw").removeAttr("disabled", "disabled");
    }
  }

  //this function solely for the player, not for com
  cardFunctions(cardName, CardIndex) {
    if (cardName === "Skip⏭") {
      //*SKIP FUNCTION*//
      prompt("Use Skip card?");
      $("#yes").on("click", () => {
        //remove prompt
        $("#prompt").remove();

        //add used card to discard pile
        this.discardPile.push(this.players[0].playerCards[CardIndex]);

        //remove from player hand
        this.players[0].playerCards.splice(CardIndex, 1);

        //reflect on board
        this.renderBoard();

        // switch player turn
        this.players[0].playerTurns = false;
        this.players[1].playerTurns = true;
        this.checkTurn();
      });
      $("#no").on("click", () => {
        //remove prompt
        $("#prompt").remove();
      });
    } else if (cardName === "Shuffle🔀") {
      //*SHUFFLE FUNCTION*//
      prompt("Use Shuffle card?");
      $("#yes").on("click", () => {
        //remove prompt
        $("#prompt").remove();

        for (let i = this.drawPile[0].length - 1; i > 0; i--) {
          //generate a random number from 0 to this.drawPile.length
          let randomIndex = Math.floor(Math.random() * (i + 1));
          let temp = this.drawPile[0][i];
          this.drawPile[0][i] = this.drawPile[0][randomIndex];
          this.drawPile[0][randomIndex] = temp;
        }

        //add used card to discard pile
        this.discardPile.push(this.players[0].playerCards[CardIndex]);

        //remove from player hand
        this.players[0].playerCards.splice(CardIndex, 1);

        //reflect on board
        this.renderBoard();
      });

      $("#no").on("click", () => {
        //remove prompt
        $("#prompt").remove();
      });
    } else if (cardName === "Attack🗡") {
      //*ATTACK FUNCTION*//
      prompt("Use Attack card?");
      $("#yes").on("click", () => {
        //remove prompt
        $("#prompt").remove();

        //add used card to discard pile
        this.discardPile.push(this.players[0].playerCards[CardIndex]);

        //remove from player hand
        this.players[0].playerCards.splice(CardIndex, 1);

        //com will draw two cards
        this.players[1].playerCards.push(
          this.drawPile[0][this.drawPile.length - 1]
        );
        this.players[1].playerCards.push(
          this.drawPile[0][this.drawPile.length - 1]
        );

        //reflect on board
        this.renderBoard();
      });
      $("#no").on("click", () => {
        //remove prompt
        $("#prompt").remove();
      });
    } else if (cardName === "See The Future👀") {
      //*SEE THE FUTURE FUNCTION*//
      prompt("Use See The Future card?");
      $("#yes").on("click", () => {
        //remove prompt
        $("#prompt").remove();

        //switch player turn
        promptThree("See The Future👀");

        //append new div and reflect card on it
        $("#promptthree").append(
          $("<p>")
            .text("Left (Top Card) -> Right (Bottom Card)")
            .addClass("stfdisplaytext")
        );
        $("#promptthree").append($("<div>").addClass("flexbox"));
        for (
          let i = this.drawPile[0].length - 1;
          i > this.drawPile[0].length - 4;
          i--
        ) {
          const $div = $("<div>").addClass("stfcard");
          $(".flexbox").append($div);
          $div.append(
            $("<p>").text(this.drawPile[0][i].name).addClass("stfcardname")
          );
          $div.append(
            $("<p>").text(this.drawPile[0][i].text).addClass("stfcardtext")
          );
        }

        //add a div to the prompt div
        $("#promptthree").append(
          $("<button>").attr("id", "btnpromptthree").text("Done")
        );

        //clear prompt
        $("#btnpromptthree").on("click", () => {
          $("#promptthree").remove();
        });

        //add used card to discard pile
        this.discardPile.push(this.players[0].playerCards[CardIndex]);

        //remove from player hand
        this.players[0].playerCards.splice(CardIndex, 1);

        //reflect on board
        this.renderBoard();
      });
      $("#no").on("click", () => {
        //remove prompt
        $("#prompt").remove();
      });
    }
  }

  //*Reflect all cards on board
  renderBoard() {
    this.reflectPlayerCard(); //loop player-cardstack and reflect cards to html
    this.reflectComCard(); //loop discard-pile and reflect cards to html
    this.reflectCardsLeft(); // reflects draw pile cards left
    this.reflectDiscard(); ////loop discard-pile and reflect cards to html
  }

  reflectPlayerCard() {
    //empty the board first
    $("#player-cardstack").empty();
    //loop player-cardstack and reflect cards to html
    const playerOne = this.players[0];
    for (let i = 0; i < playerOne.playerCards.length; i++) {
      const $div = $("<div>").addClass("pcard");
      $("#player-cardstack").append($div);
      $div.append(
        $("<p>").text(playerOne.playerCards[i].name).addClass("pcardname")
      );
      $div.append(
        $("<p>").text(playerOne.playerCards[i].text).addClass("pcardtext")
      );
    }
  }

  reflectComCard() {
    //empty the board first
    $("#computer-cardstack").empty();
    //loop computer-cardstack and reflect cards to html
    const com = this.players[1];
    for (let i = 0; i < com.playerCards.length; i++) {
      const $div = $("<div>").addClass("ccard");
      $("#computer-cardstack").append(
        $div.append(
          $("<p>").text("Mini Exploding Kittens Card Game").addClass("cardname")
        )
      );
    }
  }

  reflectCardsLeft() {
    //reflects draw pile cards left
    $("#counter").text(this.drawPile[0].length);
  }

  reflectDiscard() {
    //empty the board first
    $("#discard-pile").empty();
    //loop discard-pile and reflect cards to html
    const discardPile = this.discardPile[0];
    for (let i = 0; i < this.discardPile.length; i++) {
      const $div = $("<div>").addClass("discard");
      $("#discard-pile").append($div);
      $div.append($("<p>").text(discardPile.name).addClass("dcardname"));
      $div.append($("<p>").text(discardPile.text).addClass("dcardtext"));
    }
  }
}

///////////////////HANDLER///////////////////////
let gameBoard = new Board();
const startGame = () => {
  gameBoard = new Board();
  const name = $("input").val();
  // gameBoard.start(name, "Computer"); //turn back on once game ready
  gameBoard.start("Player", "Computer");
  console.log(gameBoard.players);
  renderPlayerTurn();
};

const prompt = (text) => {
  //Add a div with an id of prompt
  $("#gameboard-2P").append($("<div>").attr("id", "prompt"));
  //add a h3 element to the div
  $("#prompt").append($("<h3>").attr("id", "question").text(text));
  //add a div to the prompt div
  $("#prompt").append($("<div>").attr("id", "btnquestion"));
  //add buttons to div btnquestion
  $("#btnquestion").append($("<button>").attr("id", "yes").text("Yes"));
  $("#btnquestion").append($("<button>").attr("id", "no").text("No"));
  //check what the use clicked
  // $("#yes").on("click", () => {

  // });
  // $("#no").on("click", () => {

  // });
};

const promptTwo = (text) => {
  //Add a div with an id of prompttwo
  $("#gameboard-2P").append($("<div>").attr("id", "prompttwo"));
  //add a h3 element to the div
  $("#prompttwo").append($("<p>").attr("id", "texttwo").text(text));
};

const promptThree = (text) => {
  //Add a div with an id of promptthree
  $("#gameboard-2P").append($("<div>").attr("id", "promptthree"));
  //add a h3 element to the div
  $("#promptthree").append($("<p>").attr("id", "textthree").text(text));
};

///////////////////RENDER///////////////////////
const renderPlayerTurn = () => {
  $("#playertwoname").toggleClass("backlight");
  $("#playeronename").toggleClass("backlight");
};

const renderPage = () => {
  $(".page").hide();
  $(app.page).show();
  $(".instruction-page").hide();
  $(app.instructpage[0]).show(); //findEventID
};

///////////////////MAIN///////////////////////
const main = () => {
  $("#btngame").on("click", () => {
    app.page = "#inputname";
    renderPage();
  });
  $("#btnsubmit").on("click", () => {
    app.page = "#game";
    startGame();
    $("#prompt").toggle("hide");
    renderPage();
  });
  $("#btnstart").on("click", () => {
    app.page = "#start";
    renderPage();
  });
  $("#btndraw").on("click", () => {
    gameBoard.checkTurn();
    renderPage();
  });
  $("#player-cardstack").on("click", (e) => {
    console.log($(e.target.children[0]).text());
    console.log(gameBoard.players[0].playerCards);
    //this is what the player clicked
    const playerClicked = $(e.target.children[0]).text();

    //this is the card that is stored in the playerCards array
    const playerCards = gameBoard.players[0].playerCards;

    //loop thru playerCards array and reutrn player clicked index
    const searchCardIndex = playerCards.findIndex(
      (element) => element.name === playerClicked
    );
    console.log(searchCardIndex);

    //call on gameboard functions
    gameBoard.cardFunctions(playerClicked, searchCardIndex);
  });

  //   $("#btnforward").on("click", (event) => {
  //     render();
  //   });
  //     //input function later
  //     render();
  //   });
  renderPage();
};

main();
startGame();
