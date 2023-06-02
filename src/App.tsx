import { useEffect, useReducer } from 'react';
import styled from 'styled-components';

const answer = 'cake';

interface Words {
  word: string;
  status: 'correct' | 'wrong-place' | 'incorrect';
  hasSubmit: boolean;
}

function reducer(state: Words[], action: Action) {
  // console.log(state[0].word);
  const newWords: Words[] = [...JSON.parse(JSON.stringify(state))];
  const targetIndex: number = newWords.findIndex((word) => word.word === '');
  switch (action.type) {
    case 'PRESS_ENTER':
      console.log(action.payload);
      return state;
    case 'TYPE':
      newWords[targetIndex === -1 ? 0 : targetIndex].word = action.payload;
      state = newWords;
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
        <Word key={index}>{word.word}</Word>
      ))}
    </Wrapper>
  );
}

interface Action {
  type: string;
  payload: string;
}

const Wrapper = styled.div`
  display: grid;
  height: 500px;
  width: 500px;
  grid-template-columns: repeat(4, 1fr);
  margin: 100px auto;
`;

const Word = styled.div`
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 35px;
`;

export default App;
