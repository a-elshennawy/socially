import { BiSupport } from "react-icons/bi";
import { ThemeToggle } from "../Contexts/ThemeProvider";

export default function SideBar() {
  return (
    <>
      <div className="sideBar">
        <ThemeToggle />
        <span>
          <a href="https://ahmed-elshennawy.vercel.app/" target="_blank">
            <BiSupport />
          </a>
        </span>
      </div>
    </>
  );
}
