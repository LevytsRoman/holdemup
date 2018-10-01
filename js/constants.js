"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Suit;
(function (Suit) {
    Suit[Suit["HEART"] = 0] = "HEART";
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
