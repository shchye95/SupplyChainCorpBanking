import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link, useHistory } from 'react-router-dom';
import './App.css';


//Pages

class App extends Component {
  state = {
    products: []
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts = _ => {
    fetch('http://localhost:4000/products')
      .then(response => response.json())
      .then(response => this.setState({ products: response.data}))
      .catch(err => console.error(err))
  }

  renderProduct = ({ title, price }) => <div key={title}>{price}</div>

  render() {
    const { products } = this.state;
    return (
      <React.Fragment>
          <div>
              {products.map(this.renderProduct)}
          </div>
      </React.Fragment>
    );
  }
}

export default App;