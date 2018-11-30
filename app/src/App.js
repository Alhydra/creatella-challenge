import React, { Component } from 'react';
import './App.css';
import Products from "./components/Products"

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
            <h1>Products Grid</h1>

            <p>Here you're sure to find a bargain on some of the finest ascii available to purchase. Be sure to peruse our selection of ascii faces in an exciting range of sizes and prices.</p>

            <p>But first, a word from our sponsors:</p> <script>document.write('<img className="ad" src="/ads/?r=' + Math.floor(Math.random()*1000) + '"/>');</script>
        </header>

        <section>
            <Products />
        </section>
      </div>
    );
  }
}

export default App;
