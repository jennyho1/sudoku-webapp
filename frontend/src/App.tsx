import "./App.css";
import "./styles/Board.css";
import "./styles/Sidebar.css";
import Game from "./components/Game";

function App() {
  return (
    <>
      <header>
        <h1>Sudoku</h1>
      </header>
      <Game />
    </>
  );
}

export default App;
