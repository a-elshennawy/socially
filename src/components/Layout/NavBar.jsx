import PostInput from "../ReusableComponents/PostInput";
import { ThemeToggle } from "../Contexts/ThemeProvider";

export default function NavBar() {
  return (
    <>
      <nav className="row justify-content-center align-items-center m-0">
        <div className="col-lg-6 col-10 text-end p-0">
          <PostInput />
        </div>
        <div className="col-lg-6 col-2 text-end p-0">
          <ThemeToggle />
        </div>
      </nav>
    </>
  );
}
