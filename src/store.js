// store.js
import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
};

// Types
const ADD_WORD = 'ADD_WORD';
const CLEAR_WORDS = 'CLEAR_WORDS';

// Initial states
const wordsReducerState = {
  words: [],
};

// Reducers
const wordsReducer = (state = wordsReducerState, action) => {
  switch (action.type) {
    case ADD_WORD:
      return {
        ...state,
        words: [
          ...state.words,
          {
            word: action.payload.word,
            translation: action.payload.translation,
          },
        ],
      };
    case CLEAR_WORDS:
      return { ...state, words: [] };
    default:
      return state;
  }
};

// Actions
export const addWordAction = payload => {
  return { type: ADD_WORD, payload: payload };
};

export const clearWords = () => {
  return { type: CLEAR_WORDS };
};

// Create store
const rootReducer = combineReducers({
  wordsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
