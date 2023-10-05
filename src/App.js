// App.js
import React from "react";
import GameBoard from "./components/GameBoard";
import PackageJson from "../package.json";

function App() {
  return (
    <div className="App">
      <h1>
        수박 게임 베타{" "}
        <span
          style={{
            color: "grey",
            fontSize: "0.5em",
          }}
        >
          v{PackageJson.version}
        </span>
      </h1>
      <GameBoard />
    </div>
  );
}

export default App;
