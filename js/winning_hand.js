"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hand_1 = __importDefault(require("./hand"));
class WinningHand extends hand_1.default {
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
exports.default = WinningHand;
