import React, {useState} from 'react';
import "./App.css";
import bowlingPin from "./images/bowling-pin.png";
// Components
import Form from "./components/Form";
import Frames from "./components/Frames";

function App() {
  // States
  const [pinInput, setPinInput] = useState("");                                          //Stores validated pin input
  const [frameScores, setFrameScores] = useState([                                       //Stores frame data
    {id: 0},
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
    {id: 6},
    {id: 7},
    {id: 8},
    {id: 9}]); 
  const [frameCounter, setFrameCounter] = useState({frame: 1, shot: 1, gameOver: false}); //Stores current frame & current shot & gameOver status
  const [framesWithBonus, setFramesWithBonus] = useState([]);                             //Stores frames with pending bonus shots
  const [validInput, setValidInput] = useState({isValid: false, message: ""});            //Stores input validity and error messages

  const resetGame = (e) => {
    setPinInput("");
    setFrameScores([                                       
      {id: 0},
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
      {id: 6},
      {id: 7},
      {id: 8},
      {id: 9}]);
    setFrameCounter({frame: 1, shot: 1, gameOver: false});
    setFramesWithBonus([]);
    setValidInput({isValid: false, message: ""});
  };

  return(
    <div className="App">
      <header>
        <img src={bowlingPin} alt=""></img>
        <h1>Bowling Scoring</h1>
        <img src={bowlingPin} alt=""></img>
      </header>
      <Form 
        pinInput={pinInput}
        setPinInput={setPinInput}
        frameScores={frameScores}
        setFrameScores={setFrameScores}
        frameCounter={frameCounter}
        setFrameCounter={setFrameCounter}
        framesWithBonus={framesWithBonus}
        setFramesWithBonus={setFramesWithBonus}
        validInput={validInput}
        setValidInput={setValidInput}
        />
      <Frames
        frameScores={frameScores}
        frameCounter={frameCounter}/>
      <div className="resetDiv">
        <button onClick={resetGame} className="reset">Reset Game</button>
      </div>
    </div>
  );
}

export default App;
