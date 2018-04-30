import React, { Component } from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import {Provider} from 'react-redux';
import topicsContainer from './containers/topics';
import loginContainer from './containers/login';
import roomContainer from './containers/room';
import bannerContainer from './containers/banner';
import Footer from './components/footer/index.js';
import {BrowserRouter,Route} from 'react-router-dom';
class App extends Component {
  render() {
    return (
       <Provider store={store}>
          <BrowserRouter >
              <div id="main">
                <Route  path='/' component={bannerContainer} />
                <Route exact path='/' component={loginContainer} />
                <Route exact path='/login' component={loginContainer} />
                <Route exact path='/topics' component={topicsContainer}/>
                <Route path='/topics/:topicId' component={roomContainer} />
                <Route  path='/' component={Footer} />
              </div>
          </BrowserRouter>
       </Provider>
    );
  }
}



export default App;
