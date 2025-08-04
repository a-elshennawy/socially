import "./App.css";
import Home from "./components/Home";
import SideBar from "./components/SideBar";
import ThemeProvider from "./components/ThemeProvider";
import UpBtn from "./components/UpBtn";

function App() {
  return (
    <>
      <ThemeProvider>
        <Home />
        <SideBar />
        <UpBtn />
      </ThemeProvider>
    </>
  );
}

export default App;
