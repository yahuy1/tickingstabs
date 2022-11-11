import "./App.scss";
import {useEffect, useRef, useState} from 'react';

const text = "If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.";

export default function App() {
	const wordInput = useRef(null);
	const [isActive, setIsActive] = useState({ word: 0, letter: -1});
	const [words, setWords] = useState(null);

	function generateTest(text) {
		const wordList = text.split(" ");
		setWords(wordList.map((word, i) => { 
			return(
				<div className="word" value={word} key={i}>
					{
						word.split("").map((letter, j) => {
							return (
								<div className="letter" key={j}>
									{letter}
								</div>
							)
						})
					}
				</div>
			)
		}));
		setIsActive({word: -1, letter: -1});
	}
	
	useEffect(() => {generateTest(text)}, []);

	function handleModifierKeys(event) {
		let pressed = event.keyCode;
		if (pressed === 9) {
			event.preventDefault();
			generateTest(text);
		}
	}

	function handleCharacterInput(event) {
		let pressed = event.target.value;
		console.log(pressed);
		let current = Object.create(isActive);

		if (pressed === ' ') {
			if (current.letter === -1) {
				wordInput.current.value = "";
				return;
			}

			current.word++;
			current.letter = -1;

			let isCorrect = true;
			words[isActive.word].props.children.forEach((letter) => {
				if (!isCorrect) return;
				if (letter.props.className !== "letter correct") {
					isCorrect = false;
					return;
				}
			});

			console.log(isCorrect);
			let newWords = [...words];
			let	key = words[isActive.word].key;
			let word = words[isActive.word].props.value;
			newWords[isActive.word] = (
				<div className={"word" + ((isCorrect) ? " correct" : " error")} value={word} key={key}>
					{words[isActive.word].props.children}
				</div>
			)
			
			setWords(newWords);
			setIsActive(current);
			wordInput.current.value = "";
			return;
		} else {
			if (current.word === -1) {
				current.word = 0;
				current.letter = 0;
			} else {
				current.letter++;
				if (current.letter === words[current.word].props.value.length) {
					wordInput.current.value = "";
					return;
				}
			}
		}

		let newWords = [...words];
		let	key = words[current.word].key;
		let word = words[current.word].props.value;

		newWords[current.word] = (
			<div className="word" value={word} key={key}>
				{
					word.split("").map((letter, j) => {
						let newClass = words[current.word].props.children[j].props.className;
						if (j === current.letter) {
							newClass = "letter" + ((letter === pressed) ? " correct" : " error");
						} 

						return (
							<div className={newClass} key={j}>
								{letter}
							</div>
						)
					})
				}
			</div>
		);

		setWords(newWords);
		setIsActive(current);

		wordInput.current.value = "";
	}

	return (
		<div id="App">
			<div></div>
			<div className="typingTest" >
				<input 
					ref={wordInput} 
					className="wordInput" 
					autoFocus 
					onBlur={() => {wordInput.current.focus();}} 
					onKeyDown={handleModifierKeys}
					onChange={handleCharacterInput}
				/> 
				<div className="wordContainer">
					{words}
				</div>
			</div>
			<div></div>
		</div>
	)
}