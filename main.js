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
      for (let j = 0; j < 4; j++) {
        //loop thru the objects four times and create an issuing deck
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

  addDefuseCard() {
    //this function will push the defuse card int the fiveStarterCards array
    this.fiveStarterCards.push(
      new Card(
        "Defuse",
        "defuse()",
        "Use upon drawing the exploding kittens. Secretly put the exploding kitten card back to the draw pile.",
        false
      )
    );
  }

  issueFiveCards() {
    //pick 4 cards from the top as it loops down
    const iDLength = this.issuingDeck.length;
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
  }
  start(playerOneName, playerTwoName) {
    //1)create players
    this.players.push(new Player(playerOneName));
    this.players.push(new Player(playerTwoName));

    //2)create issuing deck of cards without the exploding kittens then shuffle it
    const iD = new DeckToIssue();
    iD.createIssuingDeck();
    iD.shuffleDeck();

    //3)issue the initial deck of cards by passing/storing 5 cards each to different playersCards array
    iD.issueFiveCards();
    this.players[0].playerCards = iD.fiveStarterCards;

    iD.issueFiveCards(); //invoking a second time will cause the first fiveStarterCards to be replaced with a new set of 5 cards
    this.players[1].playerCards = iD.fiveStarterCards;

    //4)Add back the exploding kittens into the deck and store it in the draw pile
    iD.addExplodingKittensCard();
    iD.shuffleDeck();
    this.drawPile.push(iD.issuingDeck);
  }
}

//check if player info(name and cards array) are created correctly [Clear later]

//Testing if it pushes to playerCards

///////////////////HANDLER///////////////////////
const startGame = () => {
  const gameBoard = new Board();
  const name = $("input").val();
  gameBoard.start(name, "Computer");
  console.log(gameBoard.players);

  renderBoard();
};

///////////////////RENDER///////////////////////
const renderBoard = () => {
  //   const $board = $("#gameboard-2P").empty();
  const $drawPile = $("#draw-pile");
  //   $drawPile.hide();
  //   $drawPile.append(this.players);
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
    render();
  });
  $("#btnstart").on("click", () => {
    app.page = "#start";
    render();
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
