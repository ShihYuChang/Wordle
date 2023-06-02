import { useEffect, useReducer } from 'react';
import styled from 'styled-components';

interface Action {
  type: string;
  payload: string;
}

interface Words {
  word: string;
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
      ? 'gery'
      : 'white'};
`;

const answer = 'cake';

function reducer(state: Words[], action: Action) {
  const newWords: Words[] = [...JSON.parse(JSON.stringify(state))];
  const targetInputIndex: number = newWords.findIndex(
    (word) => word.word === ''
  );
  const notEmptyBoxes = newWords.filter((word) => word.word !== '');
  switch (action.type) {
    case 'PRESS_ENTER':
      console.log(action.payload);
      return state;
    case 'TYPE':
      if (
        targetInputIndex !== -1 &&
        notEmptyBoxes.length < 4 &&
        /^[a-z]$/.test(action.payload)
      ) {
        newWords[targetInputIndex].word = action.payload;
        state = newWords;
        return state;
      }
      return state;
    default:
      return state;
  }
}

function App() {
  const words: Words[] = new Array(16).fill({
    word: '',
    status: '',
    hasSubmit: false,
  });
  const [state, dispatch] = useReducer(reducer, words);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'Enter':
          dispatch({ type: 'PRESS_ENTER', payload: e.key });
          break;
        default:
          dispatch({ type: 'TYPE', payload: e.key });
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Wrapper>
      {state.map((word: Words, index: number) => (
        <Word key={index} status={word.status}>
          {word.word}
        </Word>
      ))}
    </Wrapper>
  );
}

export default App;
