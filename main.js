import $ from "jquery";
import "sanitize.css";

// console.log($);

///////////////////STATE///////////////////////
const app = {
  page: "#start",
  instructpage: ["#one", "#two", "#three"],
};

class Card {
  //This is for when I want to pass new type of cards in
  constructor(name, text) {
    this.name = name;
    this.text = text;
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
    for (let i = 0; i < name.length; i++) {
      for (let j = 0; j < 2; j++) {
        //loop thru the objects two times and create an issuing deck
        this.issuingDeck.push(new Card(name[i], text[i]));
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
    this.issuingDeck.push(new Card("Exploding Kittens💣😹", "You exploded!🤯"));
  }

  addDefuseCard() {
    //this function will push the defuse card int the fiveStarterCards array
    this.fiveStarterCards.push(
      new Card(
        "Defuse🛠",
        "Use upon drawing the exploding kittens. Secretly put the exploding kitten card back to the draw pile."
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

    //4)Add back the exploding kittens into the deck, shuffle and store it in the draw pile
    iD.addExplodingKittensCard();
    iD.shuffleDeck();
    this.drawPile.push(iD.issuingDeck);

    //Display all cards to board
    this.renderBoard();

    //5) Player advantage, player will start first
    this.playerTurns = true;
    $("#playertwoname").removeClass("backlight");
    console.log(this.drawPile[0]);
  }

  draw(player) {
    const drawPile = this.drawPile[0];
    // push top(last) card from drawpile to playercards array
    player.playerCards.push(drawPile[drawPile.length - 1]);
    //check top card of the drawpile
    this.checkExplode(player);
    // remove last(top) card from drawpile
    drawPile.splice([drawPile.length - 1], 1);
  }

  checkExplode(player) {
    //loop through playerCards to find exploding
    const findExplodingIndex = player.playerCards.findIndex(
      (element) => element.name === "Exploding Kittens💣😹"
    );

    if (findExplodingIndex > 0) {
      //render backlight back to player
      renderPlayerTurn();

      //disable draw btn and player cardstack
      $("#btndraw").attr("disabled", "disabled");
      $("#player-cardstack").css("pointer-events", "none");

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
          this.drawPile[0].splice(
            randomIndex,
            0,
            player.playerCards[findExplodingIndex]
          );

          //2)Remove exploding card from player hand
          player.playerCards.splice(findExplodingIndex, 1);

          //3)Add used defuse card to discard pile
          this.discardPile.push(player.playerCards[findDefuseIndex]);

          //4)Remove defuse card from player hand
          player.playerCards.splice(findDefuseIndex, 1);

          //Reflect all cards on board
          this.renderBoard();

          //Prompt defused!
          promptTwo("Bomb have been defused!😮‍💨");

          //add a div to the prompt div
          $("#prompttwo").append(
            $("<button>").attr("id", "btnprompttwo").text("Done")
          );
          $("#btnprompttwo").on("click", () => {
            $("#prompttwo").remove();

            //enable draw button and player cardstack
            $("#btndraw").removeAttr("disabled", "disabled");
            $("#player-cardstack").css("pointer-events", "");
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
      this.draw(this.players[0]);
      this.renderBoard();
      // switch to com turn
      this.playerTurns = false;
      renderPlayerTurn();
      // this.checkTurn(); //auto draw for com and end turn as come currently no logic
      // $("#btndraw").attr("disabled", "disabled");//only turn on if use auto draw for com
      $("#player-cardstack").css("pointer-events", "none"); // stop player from using cards
    } else {
      $("#player-cardstack").css("pointer-events", ""); // allow player to use card
      this.draw(this.players[1]);
      this.renderBoard();
      // switch to player turn
      this.playerTurns = true;
      renderPlayerTurn();
      // $("#btndraw").removeAttr("disabled", "disabled");//only turn on if use auto draw for com
    }
  }

  disableDrawPCard() {
    //disable click on draw button and player cardstack
    $("#btndraw").attr("disabled", "disabled");
    $("#player-cardstack").css("pointer-events", "none");
  }

  enableDrawPCard() {
    ////enable click on draw button and player cardstack
    $("#btndraw").removeAttr("disabled", "disabled");
    $("#player-cardstack").css("pointer-events", "");
  }

  //these functions are solely for the player, not for com
  skipFunctions(cardName, cardIndex) {
    if (cardName === "Skip⏭") {
      //disable click on draw button and pcard
      this.disableDrawPCard();

      prompt("Use Skip card?");
      $("#yes").on("click", () => {
        //remove prompt
        $("#prompt").remove();

        //add used card to discard pile
        this.discardPile.push(this.players[0].playerCards[cardIndex]);

        //remove from player hand
        this.players[0].playerCards.splice(cardIndex, 1);

        ////enable click on draw button and pcard
        this.enableDrawPCard();

        //reflect on board
        this.renderBoard();

        // switch player turn
        this.playerTurns = false;
        renderPlayerTurn();
      });
      $("#no").on("click", () => {
        //remove prompt
        $("#prompt").remove();

        ////enable click on draw button and pcard
        this.enableDrawPCard();
      });
    }
  }

  shuffleFunction(cardName, cardIndex) {
    if (cardName === "Shuffle🔀") {
      //disable click on draw button and pcard
      this.disableDrawPCard();

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
        this.discardPile.push(this.players[0].playerCards[cardIndex]);

        //remove from player hand
        this.players[0].playerCards.splice(cardIndex, 1);

        //reflect on board
        this.renderBoard();

        //prompt it's shuffled
        promptTwo("Deck is shuffled!👍");

        $("#prompttwo").append(
          $("<button>").attr("id", "btnprompttwo").text("Done")
        );
        //refresh page on click
        $("#btnprompttwo").on("click", () => {
          $("#prompttwo").remove();

          ////enable click on draw button and pcard
          this.enableDrawPCard();
        });
      });

      $("#no").on("click", () => {
        //remove prompt
        $("#prompt").remove();

        ////enable click on draw button and pcard
        this.enableDrawPCard();
      });
    }
  }

  attackFunction(cardName, cardIndex) {
    if (cardName === "Attack🗡") {
      //disable click on draw button and pcard
      this.disableDrawPCard();

      prompt("Use Attack card?");
      $("#yes").on("click", () => {
        //remove prompt
        $("#prompt").remove();

        const drawPile = this.drawPile[0];

        //add used card to discard pile
        this.discardPile.push(this.players[0].playerCards[cardIndex]);

        //remove from player hand
        this.players[0].playerCards.splice(cardIndex, 1);

        //com will draw two cards
        this.players[1].playerCards.push(drawPile[drawPile.length - 1]);
        drawPile.pop();
        this.players[1].playerCards.push(drawPile[drawPile.length - 1]);
        drawPile.pop();
        this.checkExplode(this.players[1]);

        ////enable click on draw button and pcard
        this.enableDrawPCard();

        //reflect on board
        this.renderBoard();
      });
      $("#no").on("click", () => {
        //remove prompt
        $("#prompt").remove();

        ////enable click on draw button and pcard
        this.enableDrawPCard();
      });
    }
  }

  seeTheFutureFunction(cardName, cardIndex) {
    if (cardName === "See The Future👀") {
      //disable click on draw button and pcard
      this.disableDrawPCard();

      prompt("Use See The Future card?");
      $("#yes").on("click", () => {
        //remove prompt
        $("#prompt").remove();

        //add used card to discard pile
        this.discardPile.push(this.players[0].playerCards[cardIndex]);

        //remove from player hand
        this.players[0].playerCards.splice(cardIndex, 1);

        //reflect on board
        this.renderBoard();

        //switch player turn
        promptThree("See The Future👀");

        //append new div and reflect card on it
        $("#promptthree").append(
          $("<p>")
            .text("Left (Top Card) -> Right (Bottom Card)")
            .addClass("stfdisplaytext")
        );
        $("#promptthree").append($("<div>").addClass("flexbox"));
        if (this.drawPile[0].length >= 3) {
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
        } else if (this.drawPile[0].length === 2) {
          for (
            let i = this.drawPile[0].length - 1;
            i > this.drawPile[0].length - 3;
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
        } else if (this.drawPile[0].length === 1) {
          for (
            let i = this.drawPile[0].length - 1;
            i > this.drawPile[0].length - 2;
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
        }

        //add a button to the prompt div
        $("#promptthree").append(
          $("<button>").attr("id", "btnpromptthree").text("Done")
        );

        //clear prompt
        $("#btnpromptthree").on("click", () => {
          $("#promptthree").remove();

          ////enable click on draw button and pcard
          this.enableDrawPCard();
        });
      });
      $("#no").on("click", () => {
        //remove prompt
        $("#prompt").remove();

        ////enable click on draw button and pcard
        this.enableDrawPCard();
      });
    }
  }

  favorFunction(cardName, cardIndex) {
    if (cardName === "Favor🖤") {
      //disable click on draw button and pcard
      this.disableDrawPCard();

      prompt("Use Favor card?");
      $("#yes").on("click", () => {
        //remove prompt
        $("#prompt").remove();

        //add used card to discard pile
        this.discardPile.push(this.players[0].playerCards[cardIndex]);
        console.log(this.discardPile);

        //remove from player hand
        this.players[0].playerCards.splice(cardIndex, 1);

        //add a random card from com hand to player hand
        const randomIndex = Math.floor(
          Math.random() * this.players[1].playerCards.length
        );
        this.players[0].playerCards.push(
          this.players[1].playerCards[randomIndex]
        );

        //remove from com hand
        this.players[1].playerCards.splice(randomIndex, 1);

        ////enable click on draw button and pcard
        this.enableDrawPCard();

        //reflect on board
        this.renderBoard();
      });
      $("#no").on("click", () => {
        //remove prompt
        $("#prompt").remove();

        ////enable click on draw button and pcard
        this.enableDrawPCard();
      });
    }
  }

  selectComCard() {
    promptTwo("Click on a Computer Card to continue!");

    //add a button to the prompt div
    $("#prompttwo").append(
      $("<button>").attr("id", "btnprompttwo").text("Done")
    );

    //clear prompt
    $("#btnprompttwo").on("click", () => {
      $("#prompttwo").remove();

      $(".ccard").addClass("hoverler");
      $("#computer-cardstack").addClass("backlight");

      $("#computer-cardstack").on("click", (e) => {
        const index = Number(e.target.id);

        $("#prompt").remove();

        $(".ccard").removeClass("hoverler");
        $("#computer-cardstack").removeClass("backlight");

        //remove from player hand
        this.players[0].playerCards.push(this.players[1].playerCards[index]);

        //remove from com hand
        this.players[1].playerCards.splice(index, 1);

        //enable draw button and player-cardstack
        this.enableDrawPCard();

        //reflect on board
        this.renderBoard();
      });
    });
  }

  catCardFunction(cardDrawn) {
    if (cardDrawn === "Catermelon🍉") {
      //disable draw button and player-cardstack
      this.disableDrawPCard();

      const catermelonTwo = this.players[0].playerCards.filter(
        (element) => element.name === "Catermelon🍉"
      );

      if (catermelonTwo.length > 1) {
        prompt("Use Catermelon🍉 card?");
        $("#yes").on("click", () => {
          //remove prompt
          $("#prompt").remove();

          //add 2 used card to discard pile
          this.discardPile.push(catermelonTwo[1]);
          this.discardPile.push(catermelonTwo[0]);

          //remove catermelon from player hands
          const notCatermelon = this.players[0].playerCards.filter(
            (element) => element.name !== "Catermelon🍉"
          );

          this.players[0].playerCards = notCatermelon;

          this.renderBoard();

          this.selectComCard();
        });
        $("#no").on("click", () => {
          //remove prompt
          $("#prompt").remove();

          //enable and player card-stack
          this.enableDrawPCard();
        });
      } else {
        promptTwo("You need two of the same!");

        //add a button to the prompt div
        $("#prompttwo").append(
          $("<button>").attr("id", "btnprompttwo").text("Done")
        );

        //clear prompt
        $("#btnprompttwo").on("click", () => {
          $("#prompttwo").remove();

          this.enableDrawPCard();
        });
      }
    } else if (cardDrawn === "Taco Cat🌮") {
      //disable draw button and player-cardstack
      this.disableDrawPCard();

      const tacoCatTwo = this.players[0].playerCards.filter(
        (element) => element.name === "Taco Cat🌮"
      );

      if (tacoCatTwo.length > 1) {
        prompt("Use Taco Cat🌮 card?");
        $("#yes").on("click", () => {
          //remove prompt
          $("#prompt").remove();

          //add 2 used card to discard pile
          this.discardPile.push(tacoCatTwo[1]);
          this.discardPile.push(tacoCatTwo[0]);

          //remove catermelon from player hands
          const notTacoCat = this.players[0].playerCards.filter(
            (element) => element.name !== "Taco Cat🌮"
          );

          this.players[0].playerCards = notTacoCat;

          this.renderBoard();

          this.selectComCard();
        });
        $("#no").on("click", () => {
          //remove prompt
          $("#prompt").remove();

          //enable and player card-stack
          this.enableDrawPCard();
        });
      } else {
        promptTwo("You need two of the same!");

        //add a button to the prompt div
        $("#prompttwo").append(
          $("<button>").attr("id", "btnprompttwo").text("Done")
        );

        //clear prompt
        $("#btnprompttwo").on("click", () => {
          $("#prompttwo").remove();

          //enable and player card-stack
          this.enableDrawPCard();
        });
      }
    } else if (cardDrawn === "Beard Cat🧔🏼‍♀️") {
      //disable draw button and player-cardstack
      this.disableDrawPCard();

      const beardCatTwo = this.players[0].playerCards.filter(
        (element) => element.name === "Beard Cat🧔🏼‍♀️"
      );
      if (beardCatTwo.length > 1) {
        prompt("Use Beard Cat🧔🏼‍♀️ card?");
        $("#yes").on("click", () => {
          //remove prompt
          $("#prompt").remove();

          //add 2 used card to discard pile
          this.discardPile.push(beardCatTwo[1]);
          this.discardPile.push(beardCatTwo[0]);

          //remove catermelon from player hands
          const notBeardCat = this.players[0].playerCards.filter(
            (element) => element.name !== "Beard Cat🧔🏼‍♀️"
          );

          this.players[0].playerCards = notBeardCat;

          this.renderBoard();

          this.selectComCard();
        });
        $("#no").on("click", () => {
          //remove prompt
          $("#prompt").remove();

          //enable and player card-stack
          this.enableDrawPCard();
        });
      } else {
        promptTwo("You need two of the same!");

        //add a button to the prompt div
        $("#prompttwo").append(
          $("<button>").attr("id", "btnprompttwo").text("Done")
        );

        //clear prompt
        $("#btnprompttwo").on("click", () => {
          $("#prompttwo").remove();

          //enable and player card-stack
          this.enableDrawPCard();
        });
      }
    } else if (cardDrawn === "RainbowCat🌈") {
      //disable draw button and player-cardstack
      this.disableDrawPCard();

      const rainbowCatTwo = this.players[0].playerCards.filter(
        (element) => element.name === "RainbowCat🌈"
      );
      if (rainbowCatTwo.length > 1) {
        prompt("Use RainbowCat🌈 card?");
        $("#yes").on("click", () => {
          //remove prompt
          $("#prompt").remove();

          //add 2 used card to discard pile
          this.discardPile.push(rainbowCatTwo[1]);
          this.discardPile.push(rainbowCatTwo[0]);

          //remove catermelon from player hands
          const notRainbowCat = this.players[0].playerCards.filter(
            (element) => element.name !== "RainbowCat🌈"
          );

          this.players[0].playerCards = notRainbowCat;

          this.renderBoard();

          this.selectComCard();
        });
        $("#no").on("click", () => {
          //remove prompt
          $("#prompt").remove();

          //enable and player card-stack
          this.enableDrawPCard();
        });
      } else {
        promptTwo("You need two of the same!");

        //add a button to the prompt div
        $("#prompttwo").append(
          $("<button>").attr("id", "btnprompttwo").text("Done")
        );

        //clear prompt
        $("#btnprompttwo").on("click", () => {
          $("#prompttwo").remove();

          //enable and player card-stack
          this.enableDrawPCard();
        });
      }
    } else if (cardDrawn === "Potato Cat🥔") {
      //disable draw button and player-cardstack
      this.disableDrawPCard();

      const potatoCatTwo = this.players[0].playerCards.filter(
        (element) => element.name === "Potato Cat🥔"
      );
      if (potatoCatTwo.length > 1) {
        prompt("Use Potato Cat🥔 card?");
        $("#yes").on("click", () => {
          //remove prompt
          $("#prompt").remove();

          //add 2 used card to discard pile
          this.discardPile.push(potatoCatTwo[1]);
          this.discardPile.push(potatoCatTwo[0]);

          //remove catermelon from player hands
          const notPotatoCat = this.players[0].playerCards.filter(
            (element) => element.name !== "Potato Cat🥔"
          );

          this.players[0].playerCards = notPotatoCat;

          this.renderBoard();

          this.selectComCard();
        });
        $("#no").on("click", () => {
          //remove prompt
          $("#prompt").remove();

          //enable and player card-stack
          this.enableDrawPCard();
        });
      } else {
        promptTwo("You need two of the same!");

        //add a button to the prompt div
        $("#prompttwo").append(
          $("<button>").attr("id", "btnprompttwo").text("Done")
        );

        //clear prompt
        $("#btnprompttwo").on("click", () => {
          $("#prompttwo").remove();

          //enable and player card-stack
          this.enableDrawPCard();
        });
      }
    }
  }

  defuseCardPrompt(cardName) {
    if (cardName === "Defuse🛠") {
      //disable click on draw button and pcard
      this.disableDrawPCard();

      promptTwo("This card will activate automatically!");

      //add a button to the prompt div
      $("#prompttwo").append(
        $("<button>").attr("id", "btnprompttwo").text("Done")
      );

      //clear prompt
      $("#btnprompttwo").on("click", () => {
        $("#prompttwo").remove();

        //enable and player card-stack
        this.enableDrawPCard();
      });
    }
  }

  nopeCardPrompt(cardName) {
    if (cardName === "Nope🙅🏼") {
      //disable click on draw button and pcard
      this.disableDrawPCard();

      promptTwo("This card have no utility currently!🙅🏼");

      //add a button to the prompt div
      $("#prompttwo").append(
        $("<button>").attr("id", "btnprompttwo").text("Done")
      );

      //clear prompt
      $("#btnprompttwo").on("click", () => {
        $("#prompttwo").remove();

        //enable and player card-stack
        this.enableDrawPCard();
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
      const $div = $("<div>").addClass("ccard").attr("id", `${i}`);
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

    //loop discard-pile and reflect discard pile to html
    for (let i = 0; i < this.discardPile.length; i++) {
      const discardPile = this.discardPile[i];
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
  gameBoard.start("Player", "Computer");
  console.log(gameBoard.players);
};

///////////////////RENDER///////////////////////
const renderPlayerTurn = () => {
  $("#playertwoname").toggleClass("backlight");
  $("#playeronename").toggleClass("backlight");
};

const renderPage = () => {
  $(".page").hide();
  $(app.page).show();
};

const renderInstructPage = (iPage) => {
  $(".instruction-page").hide();
  $(app.instructpage[iPage]).show();
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

///////////////////MAIN///////////////////////
const main = () => {
  $("#btngame").on("click", () => {
    app.page = "#game";
    startGame();
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
    //this is what the player clicked
    const playerClicked = $(e.target.children[0]).text();

    //this is the card that is stored in the playerCards array
    const playerCards = gameBoard.players[0].playerCards;

    //loop thru playerCards array and reutrn player clicked index
    const searchCardIndex = playerCards.findIndex(
      (element) => element.name === playerClicked
    );

    //call on gameboard functions
    gameBoard.skipFunctions(playerClicked, searchCardIndex);
    gameBoard.shuffleFunction(playerClicked, searchCardIndex);
    gameBoard.attackFunction(playerClicked, searchCardIndex);
    gameBoard.seeTheFutureFunction(playerClicked, searchCardIndex);
    gameBoard.favorFunction(playerClicked, searchCardIndex);
    gameBoard.catCardFunction(playerClicked);
    gameBoard.defuseCardPrompt(playerClicked);
    gameBoard.nopeCardPrompt(playerClicked);
  });

  let iPage = 0;

  $("#btnnext").on("click", () => {
    if (iPage < app.instructpage.length - 1) {
      renderInstructPage((iPage += 1));
    }
  });

  $("#btnprevious").on("click", () => {
    if (iPage > 0) {
      renderInstructPage((iPage -= 1));
    }
  });

  renderPage();
  renderInstructPage(iPage);
};

main();
startGame();
