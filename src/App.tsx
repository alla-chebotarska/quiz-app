import React, { useState } from 'react';
import { fetchWithQuestions } from './API';
import QuestionCard from './components/QuestionCard';
//TYPES
import { QuestionState, Difficulty } from './API';

//Styles
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTION = 10;

const App = () => {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchWithQuestions(
      TOTAL_QUESTION,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);

  }

  const checkAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //Users answer
      const answer = event.currentTarget.value;
      //Check answer against correct answer
      const correct = questions[number].correct_answer === answer;

      // And score uf answer is correct
      if (correct) {
        setScore(prev => prev + 1);
      }

      //Save answer in the array for user answer
      const AnswerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      }
      setUserAnswers(prev => [...prev, AnswerObject]);
    }
  }

  const nextQuestion = () => {
    // Move to the next question if not the last question
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTION) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion)
    }

  }

  return (
    <>
    <GlobalStyle />
    <Wrapper>
      <div className="App">
        <h1>React Quiz</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTION ?
          <button className="start" onClick={startTrivia}>
            Start
        </button>
          : null
        }
        {!gameOver ?
          <p className="score">
            Score: {score}
          </p>
          : null
        }
        {loading ?
          <p>
            Loading Questions ....
      </p>
          : null}

        {!loading && !gameOver && (
          <QuestionCard
            questionNumber={number + 1}
            totalQuestions={TOTAL_QUESTION}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />)
        }

        {!gameOver &&
          !loading &&
          userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTION - 1 ? (
          <button className="next" onClick={nextQuestion}>Next Question</button>
        )
          : null}


      </div>
      </Wrapper>
    </>
  );
}

export default App;
