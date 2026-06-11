import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function WrapNavbar() {
  return (
    <>
      <Navbar />
      <main className="pt-16 sm:pt-18 md:pt-20 bg-slate-50 min-h-screen">
      <Outlet />
      </main>
    
    </>
  );
}
export default WrapNavbar;