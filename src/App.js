import React from "react";
import { css } from "styled-components/macro"; //eslint-disable-line
import View from "utils/view";
import { useState } from 'react';
import { UserContext } from './utils/UserContext';
import Header from "components/headers/light.js";
export default function App() {
  const [user, setUser] = useState("")
  return (
    <>
      <UserContext.Provider value={{ user, setUser}}>
        <View/>
      </UserContext.Provider>
    </>
  );
}
