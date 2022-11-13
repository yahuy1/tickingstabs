import "./App.scss";
import {useEffect, useRef, useState} from 'react';

//const text = "If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.";
// const text = "another head into could govern do" // between seem much open so how at say to not life when he some public first seem point move high school into way other ask";
const text = "this is"
export default function App() {
	const wordInput = useRef(null); // Reference to the input field
	const [isActive, setIsActive] = useState({ word: 0, letter: -1}); // Word + Letter currently typing
	const [words, setWords] = useState(null); // Test Text
	const [testState, setTestState] = useState(null); // State of the test
	const [correctWords, setCorrectWords] = useState(0); // Number of correct words typed
	const [timeElapsed, setTimeElapsed] = useState(0); // Time elapsed
	const [WPM, setWPM] = useState(0); // WPM

	// Generate Test Text
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
		// Reset test state, prevent calling on mount
		setCorrectWords(0);
		if (testState !== null) setTestState("Not Started");
	}
	
	// Call generateText() on load
	useEffect(() => {generateTest(text)}, []);

	// Calculate Result
	async function calculateResult() {
		let isCorrect = checkCorrect(words.length - 1);
		let finalCorrectWords = correctWords + (isCorrect === true);
		let finalWPM = Math.round((finalCorrectWords / timeElapsed) * 60);

		alert(finalWPM);
		setWPM(finalWPM)
		setCorrectWords(finalCorrectWords);
		generateTest(text);
	}

	// Timer
	useEffect(() => {
		// Non-Started states handling
		if (testState !== "Started") {
			if (testState === "Finished") calculateResult();
			if (testState === "Not Started") setTimeElapsed(0);
			return;
		}

		// State changed to Started
		const interval = setInterval(() => {
			setTimeElapsed((prevState) => {
				return prevState + 0.1;
			});
		}, 100);

		return () => {
			clearInterval(interval);
		};

	}, [testState]);

	// Check for/Handle the end of the test
	useEffect(() => {
		// If there is no test
		if (words === null) return;

		let lastWord = words.length - 1;
		let lastLetter = (isActive === words.length) ? null : words[lastWord].props.value.length - 1;

		// Return if not reached the length + 1 null word or the last letter of last word
		if (isActive.word !== lastWord + 1) {
			if (isActive.word !== lastWord || isActive.letter !== lastLetter) return;
		}

		setTestState("Finished");
	}, [isActive]);

	// Handle Modifier Keys      
	function handleModifierKeys(event) {
		let pressed = event.keyCode;

		// Tab
		if (pressed === 9) {
			event.preventDefault();
			generateTest(text);
		}

		// Backspace
		if (pressed === 8) {
			
			// If is at the start of the text
			if (isActive.word === -1) return;
			let nextActive = Object.create(isActive);

			// If reach the start of the word
			if (nextActive.letter === -1) {
				nextActive.word--; // Jumps to the previous word
				if (words[nextActive.word].props.className === "word correct") return; // If the previous word is correct, do nothing

				if (nextActive.word === -1) {
					// If reach the start of the text
					nextActive.letter = -1;
				} else {
					// Jumps to previous word's last letter;
					nextActive.letter = words[nextActive.word].props.value.length - 1;
				}

				let newWords = [...words];
				let	key = words[isActive.word].key;
				let word = words[isActive.word].props.value;

				// Set the current word to initial state
				newWords[isActive.word] = (
					<div className={"word"} value={word} key={key}>
						{
							word.split("").map((letter, j) => {
								return (
									<div className={"letter"} key={j}>
										{letter}
									</div>
								)
							})
						}
					</div>
				);
				setWords(newWords);
			} else {
				// If is in middle of a word
				nextActive.letter--;
				let newWords = [...words];
				let	key = words[isActive.word].key;
				let word = words[isActive.word].props.value;

				// Set the current word to new state state, remove class name for current letter
				newWords[isActive.word] = (
					<div className={"word"} value={word} key={key}>
						{
							word.split("").map((letter, j) => {
								if (j <= nextActive.letter) {
									return words[isActive.word].props.children[j];
								} 

								return (
									<div className={"letter"} key={j}>
										{letter}
									</div>
								)
							})
						}
					</div>
				);
				setWords(newWords);
			}

			setIsActive(nextActive);
		}
	}

	function checkCorrect(wordIndex) {
		let isCorrect = true;
		words[wordIndex].props.children.forEach((letter) => {
			if (!isCorrect) return;
			if (letter.props.className !== "letter correct") {
				isCorrect = false;
				return;
			}
		});
		return isCorrect;
	}

	// Handle Character Input
	function handleCharacterInput(event) {
		let pressed = event.target.value;
		let nextActive = Object.create(isActive);

		// Space Key
		if (pressed === ' ') {
			
			// Not testState on a word yet -> Not starting with space key
			if (nextActive.letter === -1) {
				wordInput.current.value = "";
				return;
			}

			// Started on a word -> Skip to the next word
			nextActive.word++;
			nextActive.letter = -1;

			// Check correction of the current word
			let isCorrect = checkCorrect(isActive.word);
			if (isCorrect) setCorrectWords(correctWords + 1);

			// Set state for current word based on correction
			let newWords = [...words];
			let	key = words[isActive.word].key;
			let word = words[isActive.word].props.value;
			newWords[isActive.word] = (
				<div className={"word" + ((isCorrect) ? " correct" : " error")} value={word} key={key}>
					{words[isActive.word].props.children}
				</div>
			)
			
			// Update state variables
			setWords(newWords);
			setIsActive(nextActive);
			wordInput.current.value = "";
			return;
		} else {
			// Not space key
			if (nextActive.word === -1) {
				// If the test has not started
				setTestState("Started");
				nextActive.word = 0;
				nextActive.letter = 0;
			} else {
				// If the test started
				nextActive.letter++;
				
				// If have reached the final letter of current word
				if (nextActive.letter === words[nextActive.word].props.value.length) {
					wordInput.current.value = "";
					return;
				}
			}
		}

		// Update the current word + letter
		let newWords = [...words];
		let	key = words[nextActive.word].key;
		let word = words[nextActive.word].props.value;

		newWords[nextActive.word] = (
			<div className="word" value={word} key={key}>
				{
					word.split("").map((letter, j) => {
						let newClass = words[nextActive.word].props.children[j].props.className;
						if (j === nextActive.letter) {
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

		// Update state
		setWords(newWords);
		setIsActive(nextActive);		
		wordInput.current.value = "";
	}

	return (
		<div id="App">
			<div></div>
			<div className="centerContent">
				<div></div>
				<div className="middleContainer">
					<div></div>
					<div className="typingTest">
						<div className="stats">
							<div>{Math.floor(timeElapsed)}</div>
							<div>{correctWords}</div>
						</div>
						<div className="wordContainer">
							<div className="caret"></div>
							{words}
						</div>
						<input 
							ref={wordInput} 
							className="wordInput" 
							autoFocus 
							onBlur={() => {wordInput.current.focus();}} 
							onKeyDown={handleModifierKeys}
							onChange={handleCharacterInput}
						/> 
					</div>
					<div></div>
				</div>
				<div></div>
			</div>
			<div></div>
		</div>
	)
}