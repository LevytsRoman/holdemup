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
exports.Card = Card;
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
            const card = Card.fromString(cardStr);
            hand.addCard(card);
        });
        return hand;
    }
}
exports.Hand = Hand;
class HandEvaluator {
    evaluateHand(hand) {
        let winningCards;
        if (winningCards = this.evaluateRoyalFlush(hand))
            return new WinningHand(winningCards, HandRank.ROYAL_FLUSH);
        if (winningCards = this.evaluateStraightFlush(hand))
            return new WinningHand(winningCards, HandRank.STRAIGHT_FLUSH);
        else if (winningCards = this.evaluateFourOfAKind(hand))
            return new WinningHand(winningCards, HandRank.FOUR_OF_A_KIND);
        else if (winningCards = this.evaluateFullHouse(hand))
            return new WinningHand(winningCards, HandRank.FULL_HOUSE);
        else if (winningCards = this.evaluateFlush(hand))
            return new WinningHand(winningCards, HandRank.FLUSH);
        else if (winningCards = this.evaluateStraight(hand))
            return new WinningHand(winningCards, HandRank.STRAIGHT);
        else if (winningCards = this.evaluateSet(hand))
            return new WinningHand(winningCards, HandRank.SET);
        else if (winningCards = this.evaluateDoublePair(hand))
            return new WinningHand(winningCards, HandRank.DOUBLE_PAIR);
        else if (winningCards = this.evaluatePair(hand))
            return new WinningHand(winningCards, HandRank.PAIR);
        else
            return new WinningHand(this.findHighests(5, hand.cards), HandRank.HIGH_CARD);
    }
    evaluateRoyalFlush(hand) {
        const straightFlush = this.evaluateStraightFlush(hand);
        if (straightFlush) {
            const sfHand = new Hand(straightFlush);
            if (sfHand.hasRank(Rank.ACE) && sfHand.hasRank(Rank.KING))
                return sfHand.cards;
        }
    }
    evaluateStraightFlush(hand) {
        let flush = this.evaluateFlush(hand, 7);
        let straightFlush;
        if (flush) {
            straightFlush = this.evaluateStraight(new Hand(flush));
        }
        return straightFlush;
    }
    // returns the biggest flush in a Hand
    evaluateFlush(hand, amount = 5) {
        // we need to remove other cards
        // originally the Suit is an enum but it's converted to a number
        // by typescript under the hood
        const flushCards = hand.suits.find(cardArr => cardArr.length >= 5);
        if (flushCards)
            return this.findHighests(amount, flushCards);
    }
    evaluateStraight(hand) {
        let consecutives = [];
        const length = hand.ranks.length;
        // for A2345 we put the A already in the consecutive array
        if (hand.hasRank(Rank.ACE))
            consecutives.push(hand.ranks[Rank.ACE][0]);
        // we loop through each rank in hand, if we find a group of card
        // we push the first one of the group into consecutives
        // if there is no card at said rank we reset consecutives.
        for (let i = 0; i < length; i++) {
            // we are only sure there is at least one card at that rank
            if (hand.hasRank(i))
                consecutives.push(hand.ranks[i][0]);
            else
                consecutives = [];
            // if we have 5 consecutives cards we still need to check
            // that there isn't anymore after
            if (consecutives.length >= 5) {
                const nextCards = hand.ranks[i + 1];
                if (nextCards && nextCards.length === 0) {
                    break;
                }
            }
        }
        if (consecutives.length >= 5)
            return consecutives.reverse().slice(0, 5);
    }
    evaluateFullHouse(hand) {
        const set = this.findHighestArr(3, hand);
        if (set) {
            const pair = this.findHighestArr(2, hand, set[0]);
            if (pair)
                return [...set, ...pair];
        }
    }
    evaluateFourOfAKind(hand) {
        const four = hand.ranks.find(cardArr => cardArr.length === 4);
        if (four) {
            four.push(...this.findHighests(1, hand.cards, four));
            return four;
        }
    }
    evaluateSet(hand) {
        const set = this.findHighestArr(3, hand);
        if (set) {
            set.push(...this.findHighests(2, hand.cards, set));
            return set;
        }
    }
    evaluateDoublePair(hand) {
        const pair1 = this.findHighestArr(2, hand);
        let pair2;
        if (pair1)
            pair2 = this.findHighestArr(2, hand, pair1[0]);
        if (pair1 && pair2) {
            const combination = [...pair1, ...pair2];
            return [...combination, ...this.findHighests(1, hand.cards, combination)];
        }
    }
    evaluatePair(hand) {
        const pair = this.findHighestArr(2, hand);
        if (pair) {
            pair.push(...this.findHighests(3, hand.cards, pair));
            return pair;
        }
    }
    findHighestArr(length, hand, omitted) {
        let ranksReverse = [...hand.ranks].reverse();
        // omit the ones we don't want by checking omitted rank and rank.firstcard.rank
        if (omitted)
            ranksReverse = ranksReverse.filter(arr => arr[0] && arr[0].rank !== omitted.rank);
        const set = ranksReverse
            .find(arr => arr.length >= length);
        if (set)
            return set.slice(0, length);
    }
    // get x highest number of cards
    findHighests(amount, cards = [], omitted = []) {
        // !~indexOf = not found
        const relevant = cards.filter(c => !~omitted.indexOf(c))
            .sort(Card.sortFn);
        return relevant.slice(0, amount);
    }
}
exports.HandEvaluator = HandEvaluator;
// A hand consist of the cards the player is holding + the cards on board
// Which equals to 7 cards.
// A winning hand is the best possible combination of 5 cards from those 7 cards
class WinningHand extends Hand {
    constructor(cards, rank) {
        super();
        this.rank = rank;
        super.cards = cards;
    }
    // If a hand has a rank of PAIR
    // we need to be able to compare it with another
    // wining hand that is also pair. Thus we need additional information,
    // like the high card, etc.
    // We will total 6 ranks
    calculateRanks(rank) {
        // TODO
    }
}
exports.WinningHand = WinningHand;
var Suit;
(function (Suit) {
    Suit[Suit["HEARTH"] = 0] = "HEARTH";
    Suit[Suit["SPADE"] = 1] = "SPADE";
    Suit[Suit["DIAMOND"] = 2] = "DIAMOND";
    Suit[Suit["CLUB"] = 3] = "CLUB";
})(Suit = exports.Suit || (exports.Suit = {}));
var Rank;
(function (Rank) {
    Rank[Rank["TWO"] = 0] = "TWO";
    Rank[Rank["THREE"] = 1] = "THREE";
    Rank[Rank["FOUR"] = 2] = "FOUR";
    Rank[Rank["FIVE"] = 3] = "FIVE";
    Rank[Rank["SIX"] = 4] = "SIX";
    Rank[Rank["SEVEN"] = 5] = "SEVEN";
    Rank[Rank["EIGHT"] = 6] = "EIGHT";
    Rank[Rank["NINE"] = 7] = "NINE";
    Rank[Rank["TEN"] = 8] = "TEN";
    Rank[Rank["JACK"] = 9] = "JACK";
    Rank[Rank["QUEEN"] = 10] = "QUEEN";
    Rank[Rank["KING"] = 11] = "KING";
    Rank[Rank["ACE"] = 12] = "ACE";
})(Rank = exports.Rank || (exports.Rank = {}));
var HandRank;
(function (HandRank) {
    HandRank[HandRank["HIGH_CARD"] = 0] = "HIGH_CARD";
    HandRank[HandRank["PAIR"] = 1] = "PAIR";
    HandRank[HandRank["DOUBLE_PAIR"] = 2] = "DOUBLE_PAIR";
    HandRank[HandRank["SET"] = 3] = "SET";
    HandRank[HandRank["STRAIGHT"] = 4] = "STRAIGHT";
    HandRank[HandRank["FLUSH"] = 5] = "FLUSH";
    HandRank[HandRank["FULL_HOUSE"] = 6] = "FULL_HOUSE";
    HandRank[HandRank["FOUR_OF_A_KIND"] = 7] = "FOUR_OF_A_KIND";
    HandRank[HandRank["STRAIGHT_FLUSH"] = 8] = "STRAIGHT_FLUSH";
    HandRank[HandRank["ROYAL_FLUSH"] = 9] = "ROYAL_FLUSH";
})(HandRank = exports.HandRank || (exports.HandRank = {}));
