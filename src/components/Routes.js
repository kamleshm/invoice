import React from 'react';
import { Route, Switch, BrowserRouter as Router, Link} from 'react-router-dom';
import Invoice from './maincontent/Invoice';
import SearchPage from './maincontent/SearchPage';
export const Routes = () => (
  <Router>

      <Switch>
        <Route path="/" exact component={Invoice} />
        <Route path="/search" exact component={SearchPage} />
      </Switch>
  </Router>
);
export default Routes;