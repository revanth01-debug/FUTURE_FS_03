import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useCart } from "../contexts/CartContext";
import { setAuthSession } from "../utils/auth";
import { apiUrl } from "../utils/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (value) => EMAIL_REGEX.test(value.trim());

function Aute (){
    const {setIsLogin}=useCart()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [result, setResult] = useState('');
    const navigate = useNavigate();
    const [email,setEmail] = useState('')
    const [place,setPlace] = useState('')
    const [isLoginMode, setIsLoginMode] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setEmail('');
        setPlace('');
        setResult('');
        setIsLoading(false);
    };

    const switchToRegister = (e) => {
        e?.preventDefault();
        if (isLoading) return;
        resetForm();
        setIsLoginMode(false);
    };

    const switchToLogin = (e) => {
        e?.preventDefault();
        if (isLoading) return;
        resetForm();
        setIsLoginMode(true);
    };

    const handleAuthResponse = async (response) => {
        const data = await response.json();
        if (!response.ok || !data.token) {
            setResult(data.message || "Something went wrong. Please try again.");
            return;
        }
        setAuthSession(data.token, data.role);
        setIsLogin(true);
        navigate('/', { replace: true });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setResult('');
        const trimmedEmail = email.trim();

        if (!trimmedEmail || !password) {
            setResult("Email and password are required");
            return;
        }

        if (!isValidEmail(trimmedEmail)) {
            setResult("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(apiUrl("/login"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: trimmedEmail.toLowerCase(),
                    username: trimmedEmail.toLowerCase(),
                    password,
                }),
            });
            await handleAuthResponse(response);
        } catch {
            setResult("Unable to connect. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setResult('');
        const trimmedEmail = email.trim();

        if (!username || !trimmedEmail || !place || !password) {
            setResult("All fields are required");
            return;
        }

        if (!isValidEmail(trimmedEmail)) {
            setResult("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(apiUrl("/register"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    email: trimmedEmail.toLowerCase(),
                    place,
                    password,
                }),
            });
            await handleAuthResponse(response);
        } catch {
            setResult("Unable to connect. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const shellClass = "fixed inset-0 bg-slate-900/50 flex items-start justify-center pt-4 sm:pt-10 z-50 overflow-y-auto px-3";
    const cardClass = "relative bg-white shadow-xl border border-slate-200 p-4 sm:p-6 rounded-2xl flex flex-col items-center w-[92vw] max-w-xs sm:max-w-md mb-4";
    const inputClass = "border border-slate-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-slate-100 disabled:cursor-not-allowed";
    const submitBtnClass = "relative z-20 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 transition text-white rounded-lg w-full disabled:opacity-70 disabled:cursor-not-allowed";

    if (isLoginMode) {
        return (
            <div className={shellClass}>
                <form onSubmit={handleLogin} className={`${cardClass} gap-4 sm:gap-6`}>
                    {isLoading ? (
                        <div className="absolute inset-0 rounded-2xl bg-white/60 backdrop-blur-[1px] z-10 pointer-events-none" />
                    ) : null}
                    <div>
                        <img alt='logo' className='h-12 sm:h-16' src="https://i.postimg.cc/qRrm0gPc/Whats-App-Image-2025-09-01-at-13-57-13-c417250a.jpg" />
                    </div>
                    <div className="relative z-20 w-full">
                        <label className="text-sm sm:text-base">Email</label><br/>
                        <input
                            type="email"
                            required
                            disabled={isLoading}
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div className="relative z-20 w-full">
                        <label className="text-sm sm:text-base">Password</label><br/>
                        <input
                            type="password"
                            required
                            disabled={isLoading}
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    {result ? <p className="relative z-20 text-red-500 text-xs sm:text-sm w-full">{result}</p> : null}
                    <button type="submit" disabled={isLoading} className={`${submitBtnClass} mt-2 sm:mt-4 px-4 sm:py-2`}>
                        {isLoading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                    <p className="relative z-20 text-center text-sm sm:text-base">
                        you don't have accout ?{" "}
                        <button type="button" disabled={isLoading} className='text-blue-500 disabled:opacity-50' onClick={switchToRegister}>register</button>
                    </p>
                </form>
            </div>
        );
    }

    return (
        <div className={shellClass}>
            <form onSubmit={handleRegister} className={`${cardClass} gap-2`}>
                {isLoading ? (
                    <div className="absolute inset-0 rounded-2xl bg-white/60 backdrop-blur-[1px] z-10 pointer-events-none" />
                ) : null}
                <div>
                    <img alt='logo' className='h-12 sm:h-16' src="https://img.icons8.com/fluent-systems-regular/512w/40C057/shopping-cart.png" />
                </div>
                <div className="relative z-20 w-full">
                    <label className="text-sm sm:text-base">Username</label><br/>
                    <input type="text" required disabled={isLoading} placeholder="Enter your username" value={username} onChange={(e)=> setUsername(e.target.value)} className={inputClass} />
                </div>
                <div className="relative z-20 w-full">
                    <label className="text-sm sm:text-base">Email</label><br/>
                    <input type="email" required disabled={isLoading} placeholder="Enter your email" value={email} onChange={(e)=> setEmail(e.target.value)} className={inputClass} />
                </div>
                <div className="relative z-20 w-full">
                    <label className="text-sm sm:text-base">Place</label><br/>
                    <input type="text" required disabled={isLoading} placeholder="Enter your place" value={place} onChange={(e)=> setPlace(e.target.value)} className={inputClass} />
                </div>
                <div className="relative z-20 w-full">
                    <label className="text-sm sm:text-base">Password</label><br/>
                    <input type="password" required disabled={isLoading} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
                </div>
                {result ? <p className="relative z-20 text-red-500 text-xs sm:text-sm w-full">{result}</p> : null}
                <button type="submit" disabled={isLoading} className={`${submitBtnClass} px-4 py-2`}>
                    {isLoading ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Creating account...
                        </>
                    ) : (
                        "SignUp"
                    )}
                </button>
                <p className="relative z-20 text-center text-sm sm:text-base">
                    you already have accout ?{" "}
                    <button type="button" disabled={isLoading} className='text-blue-500 disabled:opacity-50' onClick={switchToLogin}>Login</button>
                </p>
            </form>
        </div>
    );
}

export default Aute;
