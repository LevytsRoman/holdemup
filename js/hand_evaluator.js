"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const card_1 = __importDefault(require("./card"));
const hand_1 = __importDefault(require("./hand"));
const winning_hand_1 = __importDefault(require("./winning_hand"));
class HandEvaluator {
    evaluateHand(hand) {
        if (hand.cards.length < 7)
            throw new Error('When evaluating a hand, the hand must have 7 cards');
        let winningCards;
        if (winningCards = this.evaluateRoyalFlush(hand))
            return new winning_hand_1.default(winningCards, constants_1.HandRank.ROYAL_FLUSH);
        if (winningCards = this.evaluateStraightFlush(hand))
            return new winning_hand_1.default(winningCards, constants_1.HandRank.STRAIGHT_FLUSH);
        else if (winningCards = this.evaluateFourOfAKind(hand))
            return new winning_hand_1.default(winningCards, constants_1.HandRank.FOUR_OF_A_KIND);
        else if (winningCards = this.evaluateFullHouse(hand))
            return new winning_hand_1.default(winningCards, constants_1.HandRank.FULL_HOUSE);
        else if (winningCards = this.evaluateFlush(hand))
            return new winning_hand_1.default(winningCards, constants_1.HandRank.FLUSH);
        else if (winningCards = this.evaluateStraight(hand))
            return new winning_hand_1.default(winningCards, constants_1.HandRank.STRAIGHT);
        else if (winningCards = this.evaluateSet(hand))
            return new winning_hand_1.default(winningCards, constants_1.HandRank.SET);
        else if (winningCards = this.evaluateDoublePair(hand))
            return new winning_hand_1.default(winningCards, constants_1.HandRank.DOUBLE_PAIR);
        else if (winningCards = this.evaluatePair(hand))
            return new winning_hand_1.default(winningCards, constants_1.HandRank.PAIR);
        else
            return new winning_hand_1.default(this.findHighests(5, hand.cards), constants_1.HandRank.HIGH_CARD);
    }
    evaluateRoyalFlush(hand) {
        const straightFlush = this.evaluateStraightFlush(hand);
        if (straightFlush) {
            const sfHand = new hand_1.default(straightFlush);
            if (sfHand.hasRank(constants_1.Rank.ACE) && sfHand.hasRank(constants_1.Rank.KING))
                return sfHand.cards;
        }
    }
    evaluateStraightFlush(hand) {
        let flush = this.evaluateFlush(hand, 7);
        let straightFlush;
        if (flush) {
            straightFlush = this.evaluateStraight(new hand_1.default(flush));
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
        if (hand.hasRank(constants_1.Rank.ACE))
            consecutives.push(hand.ranks[constants_1.Rank.ACE][0]);
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
            .sort(card_1.default.sortFn);
        return relevant.slice(0, amount);
    }
}
exports.default = HandEvaluator;
