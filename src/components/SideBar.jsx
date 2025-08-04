import { BiSupport } from "react-icons/bi";
import { ThemeToggle } from "./ThemeProvider";
import { MdPostAdd } from "react-icons/md";

export default function SideBar() {
  return (
    <>
      <div className="sideBar">
        <ThemeToggle />
        <span>
          <a href={"#addPost"}>
            <MdPostAdd />
          </a>
        </span>
        <span>
          <a href="https://ahmed-elshennawy.vercel.app/" target="_blank">
            <BiSupport />
          </a>
        </span>
      </div>
    </>
  );
}
