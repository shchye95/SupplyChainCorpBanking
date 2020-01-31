import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

// pages
import SignUp from './components/SignUp.js';
import Login from './components/LoginPage.js';
import Financier_Profile from './components/Financier_Profile.js';
import Buyer_Profile from './components/Buyer_Profile.js';
import Seller_Profile from './components/Seller_Profile.js';
import Create_Invoice from './components/CreateInvoice.js';

import * as serviceWorker from './serviceWorker';

const routing = (
    <Router>
        <div>
            <Route path="/signup" component={SignUp}/>
            <Route path="/login" component={Login}/>
            <Route path="/financier_profile" component={Financier_Profile}/>
            <Route path="/buyer_profile" component={Buyer_Profile}/>
            <Route path="/seller_profile" component={Seller_Profile}/>
            <Route path="/create_invoice" component={Create_Invoice}/>
        </div>
    </Router>
)

ReactDOM.render(
    routing,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
