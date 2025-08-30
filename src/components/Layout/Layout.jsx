import SideBar from "./SideBar";
import UpBtn from "./UpBtn";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <SideBar />
      <Outlet />
      <UpBtn />
    </>
  );
}
