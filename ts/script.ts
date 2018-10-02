import Card from './card';
import Hand from './hand';
import HandEvaluator from './hand_evaluator';
import WinningHand from './winning_hand';
import {Suit, Rank, HandRank} from './constants';

const theRiver = [
  new Card(Rank.QUEEN, Suit.HEART),
  new Card(Rank.JACK, Suit.DIAMOND),
  new Card(Rank.QUEEN, Suit.SPADE),
  new Card(Rank.JACK, Suit.CLUB),
  new Card(Rank.SIX, Suit.SPADE)
]

const player1 = [
  new Card(Rank.QUEEN, Suit.CLUB),
  new Card(Rank.QUEEN, Suit.DIAMOND),
]

const player2 = [
  new Card(Rank.JACK, Suit.HEART),
  new Card(Rank.JACK, Suit.SPADE),
]

const hand1 = new Hand([...theRiver, ...player1])
const hand2 = new Hand([...theRiver, ...player2])

const handEvaluator = new HandEvaluator()

const winninghand1 = handEvaluator.evaluateHand(hand1)
const winninghand2 = handEvaluator.evaluateHand(hand2)
console.log(winninghand1.tieBreaker(winninghand2));


