"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// A hand consist of the cards the player is holding + the cards on board
// Which equals to 7 cards.
// A winning hand is the best possible combination of 5 cards from those 7 cards
const constants_1 = require("./constants");
const hand_1 = __importDefault(require("./hand"));
class WinningHand extends hand_1.default {
    constructor(cards, rank) {
        super(cards);
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
    tieBreaker(winningHand) {
        if (winningHand.rank === constants_1.HandRank.FOUR_OF_A_KIND) {
            const challengerRank = this.getRankFromFour(winningHand);
            const thisRank = this.getRankFromFour(this);
            if (challengerRank > thisRank) {
                return winningHand;
            }
            else if (challengerRank < thisRank) {
                return thisRank;
            }
            else {
                // while not possible in four of a kind a tie would be possible in other types of winning hands
                return false;
            }
        }
        // comparisons for other types of winning hand
    }
    getRankFromFour(hand) {
        let handRank = 0;
        hand.ranks.map((rank, i) => {
            rank.length === 4 ? handRank = i : null;
        });
    }
}
exports.default = WinningHand;
