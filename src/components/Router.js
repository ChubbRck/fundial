import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NotFound from "./NotFound";
import ClockHome from './ClockHome';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={ClockHome} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
