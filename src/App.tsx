import { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';

interface Action {
  type: string;
  payload: Payload;
}

interface Payload {
  key: string;
}

interface Words {
  character: string;
  status: 'correct' | 'wrong-place' | 'incorrect';
  hasSubmit: boolean;
}

interface WordProps {
  status: 'correct' | 'wrong-place' | 'incorrect';
}

const Wrapper = styled.div`
  display: grid;
  height: 500px;
  width: 500px;
  grid-template-columns: repeat(4, 1fr);
  margin: 100px auto;
`;

const Word = styled.div<WordProps>`
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 35px;
  background-color: ${({ status }) =>
    status === 'correct'
      ? 'green'
      : status === 'wrong-place'
      ? 'brown'
      : status === 'incorrect'
      ? 'grey'
      : 'white'};
`;

const answer = 'cake';

function reducer(state: Words[], action: Action) {
  const newWords: Words[] = [...JSON.parse(JSON.stringify(state))];
  const targetInputIndex: number = newWords.findIndex(
    (word) => word.character === ''
  );
  const notEmptyBoxes: Words[] = newWords.filter(
    (word) => word.character !== ''
  );
  const lastWord = newWords[targetInputIndex - 1];
  switch (action.type) {
    case 'TYPE':
      if (
        (notEmptyBoxes.length !== newWords.length &&
          targetInputIndex !== -1 &&
          (notEmptyBoxes.length % 4 !== 0 || notEmptyBoxes.length === 0) &&
          /^[a-z]$/.test(action.payload.key)) ||
        lastWord.hasSubmit
      ) {
        newWords[targetInputIndex].character = action.payload.key;
        state = newWords;
      }
      return state;
    case 'PRESS_ENTER':
      newWords.forEach((word: Words, index: number) => {
        if (word.character === answer[index]) {
          word.status = 'correct';
          word.hasSubmit = true;
        } else if (word.character !== '' && answer.includes(word.character)) {
          word.status = 'wrong-place';
          word.hasSubmit = true;
        } else if (word.character !== '') {
          word.status = 'incorrect';
          word.hasSubmit = true;
        }
      });
      state = newWords;
      return state;
    case 'PRESS_BACKSPACE':
      if (targetInputIndex > 0 && !lastWord.hasSubmit) {
        lastWord.character = '';
        state = newWords;
      }
      return state;
    default:
      return state;
  }
}

function App() {
  const words: Words[] = new Array(16).fill({
    character: '',
    status: '',
    hasSubmit: false,
  });
  const [state, dispatch] = useReducer(reducer, words);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'Enter':
          !isGameOver &&
            dispatch({
              type: 'PRESS_ENTER',
              payload: {
                key: e.key,
              },
            });
          break;
        case 'Backspace':
          !isGameOver &&
            dispatch({
              type: 'PRESS_BACKSPACE',
              payload: {
                key: e.key,
              },
            });
          break;
        default:
          !isGameOver &&
            dispatch({
              type: 'TYPE',
              payload: {
                key: e.key,
              },
            });
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    const hasSubmitWords = state.filter((word) => word.hasSubmit);
    if (hasSubmitWords.length === state.length) {
      setIsGameOver(true);
      alert('game over!');
    }
  }, [state]);

  return (
    <Wrapper>
      {state.map((word: Words, index: number) => (
        <Word key={index} status={word.status}>
          {word.character}
        </Word>
      ))}
    </Wrapper>
  );
}

export default App;
