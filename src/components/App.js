import React from 'react';
import '../components/App.css';
import axios from 'axios';

class App extends React.Component {
    state = {
        cards: [],
        player1: '',
        player2: '',
        isPlayerOneTurn: true
    }

    dealCards = (event) => {
        event.preventDefault()
        axios.get('http://localhost:3000/cards').then((response) => {
            console.log(response.data);
            this.setState({
                cards: response.data
            })
        })
    }


    render = ()=> {
        return (
            <div>
                <div className="header"></div>
                <div className="sidebar">
                    <button onClick={this.dealCards}>
                        Deal
                    </button>
                </div>
                <div className="gameboard">
                    <h1>Here we are</h1>
                    {this.state.cards.map((card, id) => {
                        return (
                            <div className="eachCard" key={id}><img className="cardImage" src={card.image} alt={card.name}/>{card.name}</div>
                        )}
                    )}
                </div>
            </div>
        );
    }
}

export default App;
