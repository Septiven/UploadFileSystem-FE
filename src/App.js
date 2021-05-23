import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Navbar from './Components/Navbar'
import LandingPage from './Pages/LandingPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path='/' component={LandingPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
