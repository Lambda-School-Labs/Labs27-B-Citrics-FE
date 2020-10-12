import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  useHistory,
  Switch,
} from 'react-router-dom';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';

import 'antd/dist/antd.less';
import { Layout } from 'antd';

import { NotFoundPage } from './components/pages/NotFound';
import { ExampleListPage } from './components/pages/ExampleList';
import { ProfileListPage } from './components/pages/ProfileList';
import { LoginPage } from './components/pages/Login';
import { HomePage } from './components/pages/Home';
import { ExampleDataViz } from './components/pages/ExampleDataViz';
import { config } from './utils/oktaConfig';
import { LoadingComponent } from './components/common';
import NavBar from './components/NavBar';
import Footer from './components/footer';
import MapService from './components/pages/Home/SearchBar/mapservice';
import SearchBar from './components/pages/Home/SearchBar/searchbar';
ReactDOM.render(
  <Router>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>,
  document.getElementById('root')
);

function App() {
  // The reason to declare App this way is so that we can use any helper functions we'd need for business logic, in our case auth.
  // React Router has a nifty useHistory hook we can use at this level to ensure we have security around our routes.
  const history = useHistory();

  const authHandler = () => {
    // We pass this to our <Security /> component that wraps our routes.
    // It'll automatically check if userToken is available and push back to login if not :)
    history.push('/login');
  };

  const { Header } = Layout;

  return (
    <Security {...config} onAuthRequired={authHandler}>
      <Header
        style={{
          background: '#B3B5B8',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <a>Search</a>
        <a>Trending</a>
        <a>Profile</a>
      </Header>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/implicit/callback" component={LoginCallback} />
        {/* any of the routes you need secured should be registered as SecureRoutes */}
        <Route path="/" exact component={HomePage} />
        <Route path="/map" component={MapService} />
        <Route path="/search" component={SearchBar} />
      </Switch>
    </Security>
  );
}
