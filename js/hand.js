"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = __importDefault(require("./card"));
// the Hand class contains the player cards + board cards.
class Hand {
    constructor(cards = []) {
        this.cards = [];
        // those two are used when evaluating a hand
        // take a look at evaluate hand for more details
        this.suits = new Array(4).fill(0).map(_ => []);
        this.ranks = new Array(13).fill(0).map(_ => []);
        cards.forEach(card => this.addCard(card));
    }
    addCard(card) {
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
    evaluateHand() {
        // in hold'em poker there is 5 cards on board + 2 cards in hand.
        // for convenience, the Hand class contains the board cards as well
        if (this.cards.length < 7)
            throw new Error('When evaluating a hand, the hand must have 7 cards');
    }
    hasRank(rank) {
        return this.ranks[rank].length > 0;
    }
    // gives back a string representation of the hand of the form: 7d 6h 8s Js 9s Td As
    toString() {
        return this.cards.toString().replace(/,/g, ' ');
    }
    static fromString(str) {
        const hand = new Hand();
        const cardsStr = str.split(' ');
        cardsStr.forEach(cardStr => {
            const card = card_1.default.fromString(cardStr);
            hand.addCard(card);
        });
        return hand;
    }
}
exports.default = Hand;
