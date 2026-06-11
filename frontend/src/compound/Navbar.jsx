import { Link} from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useLocation } from "react-router-dom";
import { clearAuthToken, isAdmin } from "../utils/auth";
function Navbar() {
    const {isLogin,setIsLogin}=useCart()
    const location = useLocation();
    const pathname = location.pathname;
    const canViewAdmin = isAdmin();

    const Logout = () => {
        clearAuthToken();
        setIsLogin(false)
    };
    return (
        <div className="fixed inset-x-0 top-0 z-20 border-b border-emerald-400/40 bg-green-500/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-6 md:px-10">
                <img className="h-8 w-16 sm:h-9 sm:w-18 md:h-10 md:w-20" alt="log" src="https://i.postimg.cc/HLyKdqVm/Screenshot-2025-09-01-135155.png" />
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-sm sm:text-base">
<Link
  to="/"
  className={pathname === "/"
    ? "bg-white text-green-500 px-3 py-1 rounded-lg font-semibold"
    : "font-semibold text-white/95 hover:text-white transition"}
>
  Home
</Link>

<a
  href="#about"
  className="font-semibold text-white/95 hover:text-white transition"
>
  About
</a>

<a
  href="#contact"
  className="font-semibold text-white/95 hover:text-white transition"
>
  Contact
</a>
                    {canViewAdmin ? (
                      <Link to="/admin" className={pathname==="/admin" ? ("bg-white text-green-500 px-3 py-1 border-none rounded-lg font-semibold"):("font-semibold text-white/95 hover:text-white transition")}>Admin</Link>
                    ) : null}
                    { !isLogin
                        ? (<Link to="/login" className="font-semibold text-white/95 hover:text-white transition">Login</Link>)
                        : (<button className="font-semibold text-white/95 hover:text-white transition" onClick={Logout}>Logout</button>)
                    }
                </div>
            </div>
        </div>
    );
}
export default Navbar;