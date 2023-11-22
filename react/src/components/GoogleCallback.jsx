import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import Loading from "./Loading";

function GoogleCallback() {
  const { setUser, setToken } = useStateContext();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    axiosClient
      .get(`/auth/google/callback${location.search}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
      .then((response) => {
        setLoading(false);
        const data = response.data;
        setToken(data.token);
        setUser(data.user);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }
}

export default GoogleCallback;
