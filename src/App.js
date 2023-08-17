import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addWordAction, clearWords } from './store';

const App = () => {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [gameMode, setGameMode] = useState(false);
  const [shuffledArray, setShuffledArray] = useState([]);
	const [isTriggered, setIsTriggered] = useState(false);

  const words = useSelector(state => state.wordsReducer.words);
  const dispatch = useDispatch();

  // input change
  const handleChange = (e, changeFunc) => {
    const value = e.target.value;
    changeFunc(value.toLowerCase());
  };

  // add new word
  const handleAddSubmit = e => {
    e.preventDefault();
    const obj = {
      word,
      translation,
    };

    dispatch(addWordAction(obj));
    setWord('');
    setTranslation('');
  };

  // shuffle array every time
  function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  useEffect(() => {
    setShuffledArray(shuffleArray(words));
  }, [words]);

  // change game mode
  const handleChangeGameMode = () => {
    setGameMode(prev => !prev);
		setShuffledArray(shuffleArray(words));
  };


  // clear words
  const handleClear = () => {
    dispatch(clearWords());
    setWord('');
    setTranslation('');
  };

	// check answers
	const handleCheckAnswer = () => {
		setIsTriggered(true)
		setTimeout(() => {
			setIsTriggered(false);
		}, 1)

	}

  return (
    <>
      <header className="header" id='header'>
        <h1>Study Words Daily</h1>
      </header>

      <main className="main">
        <section className="addWords">
          <form action="" className="addForm" onSubmit={handleAddSubmit}>
            <input
              type="text"
              placeholder="Word"
              required
              value={word}
              onChange={e => handleChange(e, setWord)}
            />
            <input
              type="text"
              placeholder="Translation"
              required
              value={translation}
              onChange={e => handleChange(e, setTranslation)}
            />
            <input type="submit" value="Add" className="addBtn" />
          </form>
        </section>

        <section className="cards">
          {shuffledArray.map((word, index) => (
            <Card
              key={word.word}
              {...word}
              order={index + 1}
              gameMode={gameMode}
							isTriggered={isTriggered}
            />
          ))}
        </section>
      </main>

      <footer className="footer">
        <a onClick={handleClear}>Clear</a>
        <a href="">Refresh</a>
        <a onClick={handleChangeGameMode}>Change mode</a>
        <a onClick={handleCheckAnswer}>Check</a>
        <a href="#header">Up</a>
      </footer>
    </>
  );
};

// Card component
const Card = ({ word, translation, order, gameMode, isTriggered }) => {
  const [theWordValue, setTheWordValue] = useState('');
  const [answerValue, setAnswerValue] = useState('');

  const [isRight, setIsRight] = useState(false);
  const [isWrong, setIsWrong] = useState(false);


  // display word
  useEffect(() => {
    if (!gameMode) {
      setTheWordValue(`${order}. ${translation}`);
      return;
    }

    if (gameMode) {
      setTheWordValue(`${order}. ${word}`);
      return;
    }
  }, [gameMode]);

  const handleAnswerValue = e => {
    setAnswerValue(e.target.value);
  };

	// change mode reaction
	useEffect(() => {
		setAnswerValue('')
		setIsRight(false);
		setIsWrong(false);
	}, [gameMode])

  // check answers
  const checkAnswers = () => {
    if (!gameMode && answerValue.length >= 1) {
      if (answerValue.toLowerCase() === word) {
        setIsRight(true);
        return;
      }

			setIsRight(false);
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
      }, 1500);
      return;
    }

    if (gameMode && answerValue.length >= 1) {
      if (answerValue.toLowerCase() === translation) {
        setIsRight(true);
        return;
      }

			setIsRight(false);
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
      }, 1500);
      return;
    }
  };

	useEffect(() => {
		checkAnswers();
	}, [isTriggered])

 
  return (
    <div>
      <form action="" className="cardForm">
        <input
          type="text"
          required
          readOnly
          className="theWord"
          value={theWordValue}
        />
        <input
          type="text"
          required
          placeholder="Enter translation"
					className={`theAnswer ${isRight && 'right'} ${isWrong && 'wrong'}`}
          value={answerValue}
					readOnly={isRight}
          onChange={handleAnswerValue}
        />
      </form>
    </div>
  );
};

export default App;
