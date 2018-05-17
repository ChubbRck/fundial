import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomePage from "./HomePage";
import GamePage from "./GamePage";
import PlaylistPage from "./PlaylistPage";
import CreatePage from "./CreatePage";
import NotFound from "./NotFound";
import ClockHome from './ClockHome';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={ClockHome} />
      <Route exact path="/create/" component={CreatePage} />
      <Route path="/game/:gameId" component={GamePage} />
      <Route path="/playlist/:playlistId" component={PlaylistPage} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
