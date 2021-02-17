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

let newCardsArray =[];

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
        numberOfMatches: 0,
    }

    const [cards, setCards] = useState(deck)
    const [turn, setTurn] = useState(turnObject)
    const [players, setPlayers] = useState(playersObject)

    const newTurn = () => {
        turn.cardsTurnedOver = 0;
        turn.itsAMatch = false;
        turn.firstCard = {};
        turn.secondCard = {};
        newCardsArray =[];
        setTurn(turn);
    }
    const updatePlayer = () => {
        if (turn.itsAMatch){

            // Change the players points for a match

            if (players.currentPlayer === 'Player One'){
                players.playerOnePoints += 1;
                } else if (players.currentPlayer === 'Player Two'){
                    players.playerTwoPoints += 1;
                    }
            // The player whose turn it is stays the same with a match

            setPlayers(players);
        } else if (!turn.itsAMatch) {

            // The player loses their turn without a match

            if (players.currentPlayer === "Player One") {
                players.currentPlayer = "Player Two";
            } else if (players.currentPlayer === "Player Two") {
                players.currentPlayer = "Player One";
            }
            setPlayers(players);
        }
    }

    const changeCardStatus = () => {
        // console.log(turn.itsAMatch);
        if (turn.itsAMatch) {
            turn.firstCard.status = 'hidden';
            turn.secondCard.status = 'hidden';
            newCardsArray = cards.map((card) => {
                if (card._id === turn.firstCard._id) {
                    return turn.firstCard
                } else if (card._id === turn.secondCard._id){
                    return turn.secondCard
                } else {
                    return card
                }
            })


            setCards(newCardsArray)
            } else if (!turn.itsAMatch) {
                console.log('hello');
                turn.firstCard.status = 'back';
                turn.secondCard.status = 'back';
                newCardsArray = cards.map((card) => {
                    if (card._id === turn.firstCard._id) {
                        return turn.firstCard
                    } else if (card._id === turn.secondCard._id){
                        return turn.secondCard
                    } else {
                        return card
                    }
                })

                setCards(newCardsArray);
                }
        }

    // Get the cards from the database

    const getCards = () => {
        axios.get('http://localhost:3000/cards/seed');
        axios.get('http://localhost:3000/cards').then((response) => {
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
        newCardsArray = cards.map((card) => {
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
                updatePlayer();
                break;
            }
            default : {
                changeCardStatus();
                newTurn();
                turn.cardsTurnedOver += 1;
                turn.firstCard = card;
                setTurn(turn);
                break;
            }
        }
    }


    const endOfGame = () => {
        axios.get('http://localhost:3000/cards/dropcollection');
        if (players.playerOnePoints > players.playerTwoPoints) {
            players.currentPlayer = "Player One Wins";
        } else if (players.playerTwoPoints > players.playerOnePoints) {
            players.currentPlayer = "Player Two Wins";
        } else  {
            players.currentPlayer = "Its a tie!";
        }
        players.playerOnePoints = 0;
        players.playerTwoPoints = 0;
        setPlayers(players);
        axios.get('http://localhost:3000/cards').then((response) => {
            console.log(response.data);
            setCards(response.data)
        })
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
                <button className="button instructions">Instructions
                    <p className="instructions-text">This is a card matching game that is played by two players.  The game begins when the deal button is clicked. If a player matches two cards in their turn, they receive a point and get to continue their turn. If a player does not match two cards, they forfeit their turn.  Play continues until their are no more cards to choose from and a winner is declared.</p>
                </button>
                <br/>
                <button className="button" onClick={()=>getCards()}>
                    Deal
                </button>
                <br/>
                <button onClick={()=>endOfGame()} className="button">Restart Game</button>
                <br/>
                <button className="button" id="about">About
                    <div className="about-text">
                        <h4>About Me</h4>
                        <p>This game was developed as a gift to my daughter Victoria.  She loves this game, and I was excited to implement it in this way. Feel free to contact me with any suggestions or comments.<br/><br/><a href="mailto:stevenmercer9913@gmail.com">stevenmercer9913@gmail.com</a><br/></p>
                    </div>
                </button>
                <br/>
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
