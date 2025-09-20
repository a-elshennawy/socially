import { createContext, useContext, useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <div>{children}</div>
      </ThemeContext.Provider>
    </>
  );
}

export const ThemeToggle = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <>
      <span
        onClick={() => {
          setTheme((theme) => (theme === "light" ? "dark" : "light"));
        }}
      >
        <a>{theme === "light" ? <MdDarkMode /> : <MdLightMode />}</a>
      </span>
    </>
  );
};
