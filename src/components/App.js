import React, {useState} from 'react';
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
        playertwoPoints: 0
    }

    const turnObject = {
        itsAMatch: false,
        cardsTurnedOver: 0,
        firstCard: {},
        secondCard: {},
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
        console.log(turn.itsAMatch);
        if (turn.itsAMatch) {
            turn.firstCard.status = 'hidden';
            turn.secondCard.status = 'hidden';
            let newCardsArray = cards.map((card) => {
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
            setPlayers(players);
            setCards(newCardsArray);
            }
        }
        if (!turn.itsAMatch){
            console.log('hello');
            setTimeout(function(){}, 3000);
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

            players.currentPlayer = 'Player Two';
            setPlayers(players);
            setCards(newCardsArray);
            }
        }

    // Get the cards from the database

    const getCards = () => {
        axios.get('http://localhost:3000/cards').then((response) => {
            shuffleCardsArray(response.data);
            setCards(response.data)
        })
        players.currentPlayer = 'Player One'
        setPlayers(players)
    }

    const cardFlip = (card, id) => {

        // console.log(card.status);
        const newCard = card;
        // const newId = id;
        console.log(newCard.status);
        if (newCard.status === "back") {
            newCard.status = "front"
        } else if (newCard.status === "front") {
            newCard.status = "back"
        };
        // console.log(newCard.status);
        let newCardsArray = cards.map((card) => {
            // console.log(newCard._id);
            // console.log(id);
            if (card._id === newCard._id) {
                return newCard
            } else {
                return card
            }
        })
        setCards(newCardsArray)

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
            </div>
            <div className="sidebar">
                <button onClick={()=>getCards()}>
                    Deal
                </button>
            </div>
            <div className="gameboard">
                {cards.map((card, id) => {
                    return (
                        <button className="eachCard" key={id} onClick={()=>cardFlip(card, id)}>
                            {(card.status === "front")?
                            <div><img className="cardImage" src={card.image} alt={card.name}/>{card.name}</div>
                            : (card.status === "back")?
                            <img className="cardImage" src={card.back} alt={card.name}/>
                            : <div className="hiddenCard"></div>}
                        </button>
                    )}
                )}
            </div>
        </div>
    );
}

export default App;
