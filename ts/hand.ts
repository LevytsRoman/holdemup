import { Rank, Suit } from './constants';
import Card from './card';

// the Hand class contains the player cards + board cards.
export default class Hand {
  public cards: Card[] = [];
  // those two are used when evaluating a hand
  // take a look at evaluate hand for more details
  public suits: Card[][] = new Array(4).fill(0).map(_ => []);
  public ranks: Card[][] = new Array(13).fill(0).map(_ => []);

  constructor(cards: Card[] = []) {
      cards.forEach(card => this.addCard(card));
  }

  addCard(card: Card): Hand {
      if (this.cards.length > 7)
          throw Error('Hand containing board card must have max 7 cards. This is Hold\'em');
      // precautious check to see that we can actually add the card (there shouldn't be two Ad in a deck for example)
      if (this.cards.some(c => c.toString() === card.toString()))
          throw Error('This card has already been added to this hand!');

      this.cards.push(card);
      // we are adding the suit and ranks to their respective array so we can easily
      // evaluate those.
      this.suits[card.suit].push(card);
      this.ranks[card.rank].push(card);
      return this;
  }

  hasRank(rank: Rank) {
      return this.ranks[rank].length > 0;
  }

  // gives back a string representation of the hand of the form: 7d 6h 8s Js 9s Td As
  toString() {
      return this.cards.toString().replace(/,/g, ' ');
  }

  static fromString(str: String): Hand {
      const hand = new Hand();
      const cardsStr = str.split(' ');
      cardsStr.forEach(cardStr => {
          const card = Card.fromString(cardStr);
          hand.addCard(card);
      });
      return hand;
  }
}