import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";
import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/home.css";
import "./styles/books.css";
import "./styles/details.css";
import "./styles/orders.css";
import "./styles/auth.css";
import "./styles/addBook.css";
import "./styles/loader.css";
import "./styles/profile.css";
import "./styles/checkout.css";
import "./styles/cart.css";
import "./styles/admin.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </>
  </BrowserRouter>,
);
