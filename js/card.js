"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Card {
    constructor(_rank, _suit) {
        this._rank = _rank;
        this._suit = _suit;
        if (this._rank >= Card.ranks.length)
            throw Error('A rank must be 0 and 12. ( Ace to king)');
        if (this._suit >= Card.suits.length)
            throw Error('A suit must be between 0 and 3 (h, s, d, c)');
    }
    toString() {
        return Card.ranks[this._rank] + Card.suits[this._suit];
    }
    static sortFn(a, b) {
        return b.rank - a.rank;
    }
    get suit() {
        return this._suit;
    }
    get rank() {
        return this._rank;
    }
    // transfor 4d, 7s type of strings to a new Card
    static fromString(str) {
        if (str.length !== 2)
            throw Error('Card length should be 2');
        const rank = Card.ranks.findIndex(x => x === str[0]);
        const suit = Card.suits.findIndex(x => x === str[1]);
        if (rank === -1 || suit === -1)
            throw Error(`Rank ${str[0]} or suit ${str[1]} was not found`);
        return new Card(rank, suit);
    }
}
Card.suits = ['h', 's', 'd', 'c'];
Card.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
exports.default = Card;
