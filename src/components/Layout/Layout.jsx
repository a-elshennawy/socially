import NavBar from "./NavBar";
import UpBtn from "./UpBtn";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
      <UpBtn />
    </>
  );
}
