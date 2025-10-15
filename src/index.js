/*!

=========================================================
* Spoglock Orbit - v1.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/spoglock-orbit
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/spoglock-orbit/blob/master/LICENSE.md)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import logoFavicon from "assets/img/logo.jpg";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import RTLLayout from "layouts/RTL.js";
import { AuthProvider } from "contexts/AuthContext";
import ProtectedRoute from "components/ProtectedRoute/ProtectedRoute";

ReactDOM.render(
  <AuthProvider>
    <HashRouter>
      <Switch>
        <Route path={`/auth`} component={AuthLayout} />
        <ProtectedRoute path={`/admin`} component={AdminLayout} />
        <ProtectedRoute path={`/rtl`} component={RTLLayout} />
        <Redirect from={`/`} to="/auth/signin" />
      </Switch>
    </HashRouter>
  </AuthProvider>,
  document.getElementById("root")
);

// Set favicon to brand logo at runtime
(() => {
  try {
    const head = document.head || document.getElementsByTagName("head")[0];
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "icon");
      head.appendChild(link);
    }
    link.setAttribute("type", "image/jpeg");
    link.setAttribute("href", logoFavicon);
  } catch (e) {
    // no-op
  }
})();
