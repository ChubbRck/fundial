import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NotFound from "./NotFound";
import ClockHome from './ClockHome';
import UploadPage from './UploadPage';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={ClockHome} />
      <Route exact path="/upload" component={UploadPage} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
