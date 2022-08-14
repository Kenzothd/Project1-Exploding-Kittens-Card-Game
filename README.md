# Exploding Kitten Card Game

Exploding Kittens is a highly strategic, kitty-powered version of Russian Roulette. Basically, if you draw an Exploding Kitten, you lose and you are full of loser sad-sauce. All the other cards in the deck help you avoid or mitigate your risk of drawing an Exploding Kitten. If you don't explode, YOU WIN!

This application recreate a fun board game called "Exploding Kitten". The player is able to play with the computer(No logic included).

## How to play?

![gameboard](/img/gameboard.png)

**Summary**
The game allows the player to play with a virtual player. Players can play as many cards as they like, but must end their turn by drawing a card from the draw pile. The player who draws an exploding kitten without a defuse card in hand loses.

**Rules**

1. Play a card or play a Pair from your hand by following the instructions on the card and clicking on it. Or play no cards at all; that’s cool too.

2. After the special attribute of the card is revealed, you can play more cards. You can play as many cards as you’d like.

3. Finally, end your turn by clicking the "draw" button hoping it’s not an Exploding Kitten. (This is different from most other games in that you END YOUR TURN by drawing a card.)

4. Three More Things

   - The count of the cards left in the draw pile is displayed on top of the drawpile.

   - There is no maximum or minimum hand size. If you run out of cards in your hand, there’s no special action to take. Keep playing. You’ll draw at least 1 more card on your next turn.

   - The computer have no logic hence click on "draw" and the computer will draw a card to end its turn.

**Card Types**
Exploding Kitten(1 Cards) - You must show this card immediately. Unless you have a Defuse card, you’re dead.

Defuse(4 Cards) - Upon drawing an Exploding Kitten, you can play this card instead of dying. The Defuse card will be place in the Discard Pile and the Exploding Kitten card will be placed back in the deck randomly.

Skip(2 Cards) - Immediately end your turn without drawing a card.

Attack(2 Cards) - End your turn without drawing and force the next player to take 2 turns in a row. The computer will draw 2 card as the computer have no logic.

Shuffle(2 Cards) - Shuffle the Draw Pile thoroughly and randomly without viewing the cards.

See the Future(2 Cards) - Peek at the top 3 cards from the Draw Pile and put them back in the same order.

Favor(2 Cards) - Force any other player to give you 1 card from their hand. The computer will randomly pass you a card.

Nope(2 Cards) - Stop any action except for an Exploding Kitten or a Defuse card. This card have no utility currently as the computer have no logic.

Cards with no Instructions(5 different Cards x 2 each) - These cards are powerless on their own, but can be played in Pairs. You can only play it when there's 2 of the same in your hand.

## The Set Up

![Set Up](/img/setup.png)

## Game Flow

![Game Flow](/img/gameflow.png)

## Live Version

This app is deployed on https://project1-ruby.vercel.app/

## Built With

- HTML
- CSS
- JavaScript
- jQuery

# Project Flow

- Day 1-2 : Drafting the basic game structure.
- Day 3-6 : Coding game logic.
- Day 7-9 : Debug and implement game graphic.

# Development

###### The Approach

During the development, I employed the idea of object-oriented programming. Each card in the stack is an object with a unique property that inherits from its parent class. The special attribute of the card will be revealed when it is played. By using this method, I can associate a specific procedure with an object, simplifying and ensuring my code remains comprehensive.

# Disclaimer

All trademarks, logos and brand names are the property of their respective owners. All company, product and service names used in this website are for identification and illustration purposes only. Use of these names,trademarks and brands does not imply endorsement.

This application is built for programming practice purposes only. This is not the official "Exploding Kittens" application.

If you enjoy the game, you can find out more information at http://www.explodingkittens.com.
