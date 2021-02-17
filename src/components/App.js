import React, {useState, useEffect} from 'react';
import '../components/App.css';
import axios from 'axios';

function shuffleCardsArray(array) {
  let i = array.length - 1;
  for (; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

const App = () => {

    const deck = [];

    const playersObject = {
        currentPlayer: 'Match Me',
        playerOneName: 'Player One',
        playerTwoName: 'Player Two',
        playerOnePoints: 0,
        playerTwoPoints: 0
    }

    const turnObject = {
        itsAMatch: false,
        cardsTurnedOver: 0,
        firstCard: {},
        secondCard: {},
        endOfGame: false
    }

    const [cards, setCards] = useState(deck)
    const [turn, setTurn] = useState(turnObject)
    const [players, setPlayers] = useState(playersObject)

    const newTurn = () => {
        turn.cardsTurnedOver = 0;
        turn.itsAMatch = false;
        turn.firstCard = {};
        turn.secondCard = {};
        setTurn(turn);
    }


    const checkForAMatch = () => {
        // console.log(turn.itsAMatch);
        if (turn.itsAMatch) {
            turn.firstCard.status = 'hidden';
            turn.secondCard.status = 'hidden';
            var newCardsArray = cards.map((card) => {
                if (card._id === turn.firstCard._id) {
                    return turn.firstCard
                } else if (card._id === turn.secondCard._id){
                    return turn.secondCard
                } else {
                    return card
                }
            })

            // Change the players points for a match

            if (players.currentPlayer === 'Player One'){
                players.playerOnePoints += 1;
                } else if (players.currentPlayer === 'Player Two'){
                    players.playerTwoPoints += 1;
                    }
            setPlayers(players);
            setTimeout(setCards(newCardsArray), 5000)
            } else if (!turn.itsAMatch) {
                console.log('hello');
                turn.firstCard.status = 'back';
                turn.secondCard.status = 'back';
                let newCardsArray = cards.map((card) => {
                    if (card._id === turn.firstCard._id) {
                        return turn.firstCard
                    } else if (card._id === turn.secondCard._id){
                        return turn.secondCard
                    } else {
                        return card
                    }
                })
                // console.log(players.currentPlayer);
                if (players.currentPlayer === "Player One") {
                    players.currentPlayer = "Player Two";
                } else if (players.currentPlayer === "Player Two") {
                    players.currentPlayer = "Player One";
                }
                setPlayers(players)
                setTimeout(setCards(newCardsArray), 5000);
                }
        }

    // Get the cards from the database

    const getCards = () => {
        axios.get('http://localhost:3000/cards/seed')
        axios.get('http://localhost:3000/cards').then((response) => {
            console.log(response.data);
            shuffleCardsArray(response.data);
            setCards(response.data)
        })
        players.currentPlayer = 'Player One'
        setPlayers(players)
    }

    const cardFlip = (card, id) => {

        const newCard = card;
        console.log(newCard.status);
        if (newCard.status === "back") {
            newCard.status = "front"
        };
        let newCardsArray = cards.map((card) => {
            if (card._id === newCard._id) {
                return newCard
            } else {
                return card
            }
        })

        setTimeout(setCards(newCardsArray), 3000);

        // Check for what point in the turn a player is

        switch (turn.cardsTurnedOver) {
            case 0 : {
                turn.cardsTurnedOver += 1;
                turn.firstCard = card;
                setTurn(turn);
                break;
            }
            case 1 : {
                turn.cardsTurnedOver += 1;
                turn.secondCard = card;
                if (turn.firstCard.name === turn.secondCard.name) {
                    turn.itsAMatch = true
                }
                setTurn(turn);
                checkForAMatch();
                newTurn();
                break;
            }
            default : {
                newTurn();
                break;
            }
        }
    }

    return (
        <div>
            <div className="header">
                <div className="currentPlayer">{players.currentPlayer}</div>
                <div className="score">
                    <h3 className="p1score">{players.playerOneName} : {players.playerOnePoints || 0}</h3>
                    <h3 className="p2score">{players.playerTwoName} : {players.playerTwoPoints || 0}</h3>
                </div>
            </div>
            <div className="sidebar">
                <button onClick={()=>getCards()}>
                    Deal
                </button>
            </div>
            <div className="gameboard">
                {cards.map((card, id) => {
                    return (
                        <div className="eachCard" key={id}>
                            {(card.status === "front")?
                            <div ><img  className="cardImage" src={card.front} alt={card.name}/>{card.name}</div>
                            : (card.status === "back")?<button  onClick={()=>cardFlip(card, id)}>
                            <img className="cardBack" src={card.back} alt={card.name}/></button>
                            : <div className="hiddenCard" disabled></div>}
                        </div>
                    )}
                )}
            </div>
        </div>
    );
}

export default App;
