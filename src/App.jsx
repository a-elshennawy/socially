import "./App.css";
import Home from "./components/Home";
import SideBar from "./components/SideBar";
import ThemeProvider from "./components/ThemeProvider";

function App() {
  return (
    <>
      <ThemeProvider>
        <Home />
        <SideBar />
      </ThemeProvider>
    </>
  );
}

export default App;
