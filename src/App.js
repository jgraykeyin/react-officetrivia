import { React, useState, useEffect } from 'react'
import './App.css';
import Titlebar from './Components/Titlebar'
import QuoteOutput from './Components/QuoteOutput'
import TriviaOptions from './Components/TriviaOptions'


function App() {

  const [characters, setCharacters] = useState('');
  const [quote, setQuote] = useState([]);
  const [answer, setAnswer] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [userResult, setUserResult] = useState('Correct!');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  // Initliaze the question. Fetch a random quote and setup the answer options.
  const QuestionInit = () => {

    setRound(round+1);

    // Fetch the JSON data
    fetch('data/theoffice_lines.json')
    .then((response) => response.json())
    .then((json) => {

      // Limit the game to specific characters from the show
      const full_cast = ["Michael", "Jim", "Pam", "Dwight", "Angela", "Kelly", "Ryan", "Kevin", "Andy", "Meredith","Oscar","Phyllis", "Creed", "Stanley", "Toby", "Erin", "Darryl", "Jan", "Gabe"];
      
      // Make sure we select a quote by a character in our cast list
      let casting_done = false;
      let id = 0;

      // This clunky loop makes sure we get a random quote from an accepted cast member
      while (casting_done === false) {

        id = Math.floor(Math.random() * Object.keys(json).length);

        if (full_cast.includes(json[id]["speaker"])) {
          setQuote(json[id]["line_text"]);
          setAnswer(json[id]["speaker"]);
          casting_done = true;
        } else {
          console.log("Trying another line");
        }
      }

      // Select five random cast members as answer options
      let available_cast = [];
      while (available_cast.length < 5) {
      
        let random_character = full_cast[Math.floor(Math.random() * full_cast.length)];

        // Another clunky hack to make sure we don't get duplicates.
        // TODO: This probably isn't working
        if (available_cast.includes(random_character)) {
          console.log("Skipping...");
          continue;
        } else {
          available_cast.push(random_character.toString().toLowerCase());
        }
      }
  
      // Make sure the available cast includes the answer for the current question
      if (available_cast.includes(answer)) {
        console.log("Already included")
      } else {
        let random_index = Math.floor(Math.random() * 5);
        available_cast[random_index] = json[id]["speaker"].toLowerCase();
      }
  
      setCharacters(available_cast);
    })
  }


  // Initalize a question as soon as the page loads
  useEffect(() => {
    QuestionInit();
  }, []);


  // When a user clicks an answer option, show the Submit button and save selected option
  const handleClick = (e) => {
    if (showResult === false) {
      setShowSubmit(true);
      setUserAnswer(e["target"]["alt"])
    } else {
      console.log("Nothing to do")
    }
  }


  // Submit Answer, check for a pass or fail
  const handleSubmit = () => {
    if (userAnswer.toLowerCase() === answer.toLowerCase()) {
      setUserResult(`Correct, it was ${answer}!`);
      setScore(score+1);
    } else {
      setUserResult(`Sorry, it was ${answer}`);
    }

    setShowResult(true);
    setShowSubmit(false);
  }


  const handleNext = () => {
    setShowSubmit(false);
    setShowResult(false);
    QuestionInit();
  }


  return (
    <div className="App">
      
      <div className="Main-frame">
        <Titlebar></Titlebar>
        <QuoteOutput quote={quote}></QuoteOutput>
        <div className="Whosaid">Who said it?</div>
        <div className="Profiles">
          <TriviaOptions name={characters[0]} onPress={handleClick}></TriviaOptions>
          <TriviaOptions name={characters[1]} onPress={handleClick}></TriviaOptions>
          <TriviaOptions name={characters[2]} onPress={handleClick}></TriviaOptions>
          <TriviaOptions name={characters[3]} onPress={handleClick}></TriviaOptions>
          <TriviaOptions name={characters[4]} onPress={handleClick}></TriviaOptions>
        </div>
        <div>
          { showSubmit ? <button className="SubmitBtn" onClick={handleSubmit}>Submit Answer</button> : null }
          { showResult ? <p className="UserResults">{userResult}</p> : null }
          { showResult ? <button className="NextBtn" onClick={handleNext}>Next Quote</button> : null }
        </div>
        <div className="Score">Score: {score} / {round}</div>
        <div><p>Debug Answer: {answer}</p></div>
      </div>

    </div>
  );
}

export default App;
