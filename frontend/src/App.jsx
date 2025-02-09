import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "./container/Container.jsx";
import {
  login as storeLogin,
  logOut as storeLogout,
} from "./store/authSlice.js";
import Header from "./components/header/Header.jsx";
import { Outlet } from "react-router-dom";
import authservice from "./backend/auth.config.js";
function App() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    authservice
      .checkRefresh()
      .then((res) => {
        if (res.status == 200) {
          authservice
            .refreshTokens()
            .then(() => {
              authservice
                .getCurrentUser()
                .then((res) => {
                  if (res?._id) {
                    dispatch(storeLogin({ userData: res }));
                  } else {
                    dispatch(storeLogout());
                  }
                })
                .catch(() => {
                  dispatch(storeLogout());
                  navigate("/login");
                })
                .finally(() => setLoading(false));
            })
            .catch(() => {
              dispatch(storeLogout());
              navigate("/login");
            });
        } else {
          dispatch(storeLogout());
        }
      })
      .catch(() => {
        dispatch(storeLogout());
        navigate("/login");
      });
  }, []);

  return !loading ? (
    <Container>
      <Header />
      <Outlet />
    </Container>
  ) : null;
}

export default App;
