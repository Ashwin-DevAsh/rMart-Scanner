import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ListProducts from './Pages/ListProducts';
import './App.global.css';

export const ProductContext = React.createContext(null);

export default function App() {
  return (
    // <ProductContext.Provider value={{ products: null }}>
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route
          path="/:orderID"
          render={({ match }) => <HomePage orderID={match.params.orderID} />}
        />
        <Route
          path="/listProducts/:qrCode"
          render={({ match }) => <ListProducts qrCode={match.params.qrCode} />}
        />
      </Switch>
    </Router>
    // </ProductContext.Provider>
  );
}
