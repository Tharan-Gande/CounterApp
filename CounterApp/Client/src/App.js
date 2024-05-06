import React, { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
//import CounterContext from './CounterContext';
import axios from 'axios';

// Counter context
const CounterContext = React.createContext();

// Reducer function for managing counter state
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return {...state, count: action.count };
    case 'INCREMENT':
      return { ...state,count: state.count + 1 };
    case 'DECREMENT':
      return { ...state,count: state.count - 1 };
    case 'MYSET':
      return { ...state,mycount: action.mycount };
    case 'MYINCREMENT':
      return { ...state,mycount: state.mycount + 1};
    case 'MYDECREMENT':
      return {...state, mycount: state.mycount - 1}
    default:
      return state;
  }
};

const Home = () => {
  const { state } = useContext(CounterContext);

  return (
    <div>
      <h1>Counter Value: {state.count}</h1>
      <Link to="login/home/counter">Counter</Link>
      <h1>MyCounter Value: {state.mycount}</h1>
      <Link to="login/home/mycounter">MyCounter</Link>
    </div>
    
  );
};
  
  const Counter = () => {
    const { state, dispatch } = useContext(CounterContext);
    const navigate = useNavigate();
    
    const fetchCounter = useCallback(async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/counter');
        dispatch({ type: 'SET', count: response.data.count });
      } catch (err) {
        console.error(err);
      }
    }, [dispatch]);
    
    useEffect(() => {
      fetchCounter();
    }, [fetchCounter]);
    
    const incrementCounter = useCallback(async () => {
      try {
        await axios.post('http://localhost:5000/api/counter/increment');
        dispatch({ type: 'INCREMENT' });
      } catch (err) {
        console.error(err);
      }
    }, [dispatch]);
    
    const decrementCounter = useCallback(async () => {
      try {
        await axios.post('http://localhost:5000/api/counter/decrement');
        dispatch({ type: 'DECREMENT' });
      } catch (err) {
        console.error(err);
      } 
    }, [dispatch]);
    
    return (
      <div>
      <h2>Counter</h2>
      <p>Count: {state.count}</p>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
      <button onClick={() => navigate('login/home')}>Go to Home</button>
    </div>
  );
};


const MyCounter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();
  
  const fetchMyCounter = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Counter');
      dispatch({ type: 'MYSET', mycount: response.data.mycount });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMyCounter();
  }, [fetchMyCounter]);

  const incrementMyCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/increment');
      dispatch({ type: 'MYINCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementMyCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/decrement');
      dispatch({ type: 'MYDECREMENT' });
    } catch (err) {
      console.error(err);
    } 
  }, [dispatch]);

  return (
    <div>
      <h2>MyCounter</h2>
      <p>MyCount: {state.mycount}</p>
      <button onClick={incrementMyCounter}>Increment</button>
      <button onClick={decrementMyCounter}>Decrement</button>
      <button onClick={() => navigate('login/home')}>Go to Home</button>
    </div>
  );
};

const responseGoogle = (response) => {
  console.log(response);
  // Handle Google OAuth response
};
const GoogleAuth = () => {
  return (
    <GoogleLogin
      clientId="501637194300-mq1ggjtibp0bqk1v91uetihjckd6jdn1.apps.googleusercontent.com"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
    />
  );
};


const App = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 ,mycount: 0 });

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/login/">Login</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="login/home" element={<Home />} />
            <Route path="login/home/counter" element={<Counter />} />
            <Route path="login/home/mycounter" element={<MyCounter />} />
            <Route path="/login/" element={<GoogleAuth />} />
          </Routes>
        </div>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;
