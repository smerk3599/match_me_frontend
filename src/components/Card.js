import '../components/App.css';

function Card(c) {
    console.log(c.flipped);
    return (

        <div className="Card">
            <h1>{c.flipped?c.cardValue:'#'}</h1>
        </div>
  );
}

const card ={cardValue:1, flipped:true}

export default Card;
