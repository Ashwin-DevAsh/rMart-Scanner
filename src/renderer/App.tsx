import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import {HomePage} from './Pages/HomePage';
import './App.global.css';

export const ProductContext = React.createContext(null);

export default function App() {
  return (
    // <ProductContext.Provider value={{ products: null }}>
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
    </Router>
    // </ProductContext.Provider>
  );
}
