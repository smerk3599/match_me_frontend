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

    const turnObject = {
        isPlayerOnesTurn: true,
        cardsTurnedOver: 0
    }

    const [cards, setCards] = useState(deck)
    const [turn, setTurn] = useState(turnObject)

    const getCards = () => {
        console.log('hello');
        axios.get('http://localhost:3000/cards').then((response) => {
            shuffleCardsArray(response.data);
            setCards(response.data)
        })
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
        console.log(newCard.status);
        let newCardsArr = cards.map((card) => {
            console.log(newCard._id);
            // console.log(id);
            if (card._id === newCard._id) {
                return newCard
            } else {
                return card
            }
        })
        // console.log(card.status);
        console.log(newCardsArr);
        setCards(newCardsArr)
    }

    return (
        <div>
            <div className="header"></div>
            <div className="sidebar">
                <button onClick={()=>getCards()}>
                    Deal
                </button>
            </div>
            <div className="gameboard">
                <h1>Here we are</h1>
                {console.log(cards)}
                {cards.map((card, id) => {
                    // console.log(card);
                    console.log(card.status);
                    return (
                        <button className="eachCard" key={id} onClick={()=>cardFlip(card, id)}>
                            {(card.status === "front")?
                            <div><img className="cardImage" src={card.image} alt={card.name}/>{card.name}</div>
                            : (card.status === "back")?
                            <img className="cardImage" src={card.back} alt={card.name}/>
                            : <img className="hiddenCard" src={""} alt={card.name}/>}
                        </button>
                    )}
                )}
            </div>
        </div>
    );
}

export default App;
