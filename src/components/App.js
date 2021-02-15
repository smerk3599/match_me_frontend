import React from 'react';
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

class App extends React.Component {
    state = {
        cards: [],
        player1: '',
        player2: '',
        isPlayerOnesTurn: true
    }

    getCards = (e) => {
        e.preventDefault()
        axios.get('http://localhost:3000/cards').then((response) => {
            shuffleCardsArray(response.data);
            this.setState({
                cards: response.data,
            })
        })
    }

    cardFlip = (card, e) => {
        // e.preventDefault()
        // const toggle = card.isFlipped;
        // console.log(card.isFlipped);
        // this.setState({
        //     card.isFlipped: !(toggle)
        // })

    }


    render = ()=> {
        return (
            <div>
                <div className="header"></div>
                <div className="sidebar">
                    <button onClick={this.getCards}>
                        Deal
                    </button>
                </div>
                <div className="gameboard">
                    <h1>Here we are</h1>
                    {this.state.cards.map((card, id) => {
                        console.log(card);
                        console.log(card.isFlipped);
                        return (
                            <button className="eachCard" key={id} onClick={() =>this.cardFlip(card)}><img className="cardImage" src={card.image} alt={card.name}/>{card.name}</button>
                        )}
                    )}
                </div>
            </div>
        );
    }
}

export default App;
