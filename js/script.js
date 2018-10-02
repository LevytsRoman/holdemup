"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = __importDefault(require("./card"));
const hand_1 = __importDefault(require("./hand"));
const hand_evaluator_1 = __importDefault(require("./hand_evaluator"));
const constants_1 = require("./constants");
const theRiver = [
    new card_1.default(constants_1.Rank.QUEEN, constants_1.Suit.HEART),
    new card_1.default(constants_1.Rank.JACK, constants_1.Suit.DIAMOND),
    new card_1.default(constants_1.Rank.QUEEN, constants_1.Suit.SPADE),
    new card_1.default(constants_1.Rank.JACK, constants_1.Suit.CLUB),
    new card_1.default(constants_1.Rank.SIX, constants_1.Suit.SPADE)
];
const player1 = [
    new card_1.default(constants_1.Rank.QUEEN, constants_1.Suit.CLUB),
    new card_1.default(constants_1.Rank.QUEEN, constants_1.Suit.DIAMOND),
];
const player2 = [
    new card_1.default(constants_1.Rank.JACK, constants_1.Suit.HEART),
    new card_1.default(constants_1.Rank.JACK, constants_1.Suit.SPADE),
];
const hand1 = new hand_1.default([...theRiver, ...player1]);
const hand2 = new hand_1.default([...theRiver, ...player2]);
const handEvaluator = new hand_evaluator_1.default();
const winninghand1 = handEvaluator.evaluateHand(hand1);
const winninghand2 = handEvaluator.evaluateHand(hand2);
winninghand1.tieBreaker(winninghand2);
