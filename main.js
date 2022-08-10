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
  constructor(name, utility, text, isUsed) {
    this.name = name;
    this.utility = utility;
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
      "Attack",
      "Skip",
      "Favor",
      "Shuffle",
      "Potato Cat",
      "Beard Cat",
      "Taco Cat",
      "Catermelon",
      "Rainbow Cat",
      "See The Future",
      "Nope",
      "Defuse",
    ];
    let utility = [
      "attack()",
      "skip()",
      "favor()",
      "shuffle()",
      "twoSame()",
      "twoSame()",
      "twoSame()",
      "twoSame()",
      "twoSame()",
      "seeFuture()",
      "nope()",
      "defuse()",
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
        this.issuingDeck.push(
          new Card(name[i], utility[i], text[i], isUsed[i])
        );
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
      new Card("Exploding Kittens", "explode()", "You exploded!", false)
    );
  }

  explodingKittensCard() {
    //this will create an exploding kittens card
    new Card("Exploding Kittens", "explode()", "You exploded!", false);
  }

  addDefuseCard() {
    //this function will push the defuse card int the fiveStarterCards array
    this.fiveStarterCards.push(
      new Card(
        "Defuse",
        this.defuse,
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
    iD.addExplodingKittensCard(); //!!!!remove once done this add the exploding to the top of the deck
    // iD.addExplodingKittensCard(); //!!!!remove once done this add the exploding to the top of the deck
    this.drawPile.push(iD.issuingDeck);

    //loop player-cardstack,com-cardstack and drawpile then reflect cards to html
    this.reflectPlayerCard();
    this.reflectComCard();
    this.reflectCardsLeft();
    console.log(this.drawPile); // check if draw pile is correct

    //5) Player advantage, player will start first
    this.playerTurns = true;
    $("#playeronename").toggleClass("backlight");
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

  draw(player) {
    const drawPile = this.drawPile[0];
    //check top card of the drawpile
    this.checkExplode(drawPile[drawPile.length - 1], player);
    // push top(last) card from drawpile to playercards array
    player.playerCards.push(drawPile[drawPile.length - 1]);
    // remove last(top) card from drawpile
    drawPile.splice([drawPile.length - 1], 1);
    // console.log(this.drawPile);

    renderBoard();
    // console.log(this.playerTurns); //check whose turns
    // console.log(player.playerCards); //check player cards
  }

  checkExplode(cardDrawn, player) {
    if (cardDrawn.name === "Exploding Kittens") {
      renderBoard();
      //loop thru playerCards array and find for defuse card
      const findDefuseIndex = player.playerCards.findIndex(
        (element) => element.name === "Defuse"
      );
      if (findDefuseIndex < 0) {
        //if no defuse card
        promptTwo("You Lose!🥲");
        player.lose = true;
      } else {
        //if have defuse card
        prompt("You Exploded!🤯 Use defuse card?");

        $("#yes").on("click", () => {
          //console.log(player.playerCards[findDefuseIndex]);
          //player.playerCards[findDefuseIndex].utility();
          //remove prompt statement
          $("#prompt").toggle("hide");
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

          //5)Reflect player cards
          this.reflectPlayerCard();
          this.reflectComCard();

          //6)Reflect discard and drawpile cards
          console.log(this.discardPile);
          this.reflectDiscard();
          this.reflectCardsLeft();

          //Prompt defused!
          promptTwo("Bomb have been defused!😮‍💨");
          $("#btnprompttwo").on("click", () => {
            $("#prompttwo").toggle("hide");
          });

          renderBoard();
        });
        $("#no").on("click", () => {
          //remove prompt statement
          $("#prompt").toggle("hide");
          promptTwo("You Lose!🥲");
          player.lose = true;
        });
      }
    } else {
      console.log("not yet");
    }
  }

  //check turn --> player draw --> reflects card --> switch player
  checkTurn() {
    if (this.playerTurns === true) {
      this.draw(this.players[0]);
      this.reflectPlayerCard(); //loop player-cardstack and reflect cards to html
      this.reflectDiscard(); //loop discard-pile and reflect cards to html
      this.reflectCardsLeft(); // reflects draw pile cards left
      this.playerTurns = false;
      console.log(this.playerTurns);
    } else {
      this.draw(this.players[1]);
      this.reflectComCard(); //loop computer-cardstack and reflect cards to html
      this.reflectDiscard(); //loop discard-pile and reflect cards to html
      this.reflectCardsLeft(); // reflects draw pile cards left
      this.playerTurns = true;
      // this.drawCom();////com currently no logic, hence will draw to end turn
      console.log(this.playerTurns);
    }
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
  renderBoard();
};

gameBoard.reflectDiscard();

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
  //   console.log(true);
  //   // return true;
  // });
  // $("#no").on("click", () => {
  //   $("#prompt").toggle("hide");
  // });
};

const promptTwo = (text) => {
  //Add a div with an id of prompt
  $("#gameboard-2P").append($("<div>").attr("id", "prompttwo"));
  //add a h3 element to the div
  $("#prompttwo").append($("<h3>").attr("id", "texttwo").text(text));
  //add a div to the prompt div
  $("#prompttwo").append($("<button>").attr("id", "btnprompttwo").text("Done"));
};

// function defuse() {
//   // console.log(gameBoard.drawPile);
//   gameBoard.players[0].playerCards.pop();
//   console.log(gameBoard.players[0].playerCards);
//   // const randomIndex = Math.floor(Math.random() * gameBoard.drawPile.length);
//   // gameBoard.drawPile.slice(0, randomIndex).push();
//   // console.log(gameBoard.player.playerCards.length);
// }

///////////////////RENDER///////////////////////
const renderBoard = () => {
  //   const $board = $("#gameboard-2P").empty();
  //   $drawPile.hide();
  //   $drawPile.append(this.players);
  // const r = new Board();
  gameBoard.reflectCardsLeft();
  $("#playertwoname").toggleClass("backlight");
  $("#playeronename").toggleClass("backlight");
};

const render = () => {
  $(".page").hide();
  $(app.page).show();
  $(".instruction-page").hide();
  $(app.instructpage[0]).show(); //findEventID
};

///////////////////MAIN///////////////////////
const main = () => {
  $("#btngame").on("click", () => {
    app.page = "#inputname";
    render();
  });
  $("#btnsubmit").on("click", () => {
    app.page = "#game";
    startGame();
    $("#prompt").toggle("hide");
    render();
  });
  $("#btnstart").on("click", () => {
    app.page = "#start";
    render();
  });
  $("#btndraw").on("click", () => {
    gameBoard.checkTurn();
    render();
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

    //return the card function
    playerCards[searchCardIndex].utility();
  });

  //   $("#btnforward").on("click", (event) => {
  //     render();
  //   });
  //     //input function later
  //     render();
  //   });
  render();
};

main();
startGame();
