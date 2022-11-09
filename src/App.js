import "./App.scss";
import {useRef, useState} from 'react';

const text = "If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.";

export default function App() {
  const wordInput = useRef(null);
  const ref = useRef(null);
  const [isActive, setIsActive] = useState({ word: 0, letter: 0});
  
  function generateTest(text) {
    const wordList = text.split(" ");
    return wordList.map((word, i) => { 
      return(
        <div className={`word ${(isActive.word !== i) ? "" : " active"}`} key={i}>
          {
            word.split("").map((letter, j) => {
              return (
                <div className={`letter ${(isActive.letter !== j) ? "" : " active"}`} inWord={i} key={j}>
                  {letter}
                </div>
              )
            })
          }
        </div>
      )
    });
  }

  function handleInput(event) {
    
    if (event.target.value !== ' ') {
      let newActive = isActive;
      if (newActive.word === -1) {
        newActive.word++;
        newActive.letter++;
      } else {
        newActive.letter++;
      }
      setIsActive(newActive);
      console.log(event.target.value, isActive);
    } else {

    }
    wordInput.current.value = "";
  }

  return (
    <div id="App">
      <div></div>
      <div className="typingTest">
        <input ref={wordInput} className="wordInput" autoFocus onBlur={() => {wordInput.current.focus();}} onChange={handleInput}/>
        <div className="wordContainer">
          {generateTest(text)}
        </div>
      </div>
      <div></div>
    </div>
  )
}