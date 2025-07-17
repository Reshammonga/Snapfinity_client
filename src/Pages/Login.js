import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import "../App.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const [form, setform] = useState({ email: "", password: "" });
  const navigate=useNavigate();
  const [alert, setalert] = useState({show:'',msg:'',type:''});

  const handleChange = (e) =>
    setform({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const resultAction = await dispatch(loginUser(form));
    if(loginUser.fulfilled.match(resultAction)){
      setalert({show:'true',type: 'Success',msg:'Login Successfully'});
      setTimeout(() => {
          navigate('/');
      }, 1500);
    
    }else{
      setTimeout(() => {
         setalert({ show: true, type: 'Error',msg:  "Login failed" });
      }, 1500);
     
    }}catch(error){
     setalert({ show: true, type: 'Error', msg: "Something went wrong" });
    }
    
  };
  return (

    <div className="brownbackground min-h-screen m-0 sm:m-3">
          {alert.show && (
  <div className={`alert` } style={{backgroundColor : '#C7B7A3' , color : 'black'}} role="alert">
    {`${alert.type} : ${alert.msg}`}
  </div>
)}
      <div className="flex flex-col sm:flex-row ">
        {/* Left column */}
        <div className='"w-full sm:basis-1/3 sm:w-[50%] flex items-center justify-center mt-5'>
          <form
            className="whitebackground flex flex-col gap-4  shadow-[0_4px_30px_rgba(255,255,255,0.5)] p-8 rounded-xl w-[90%] max-w-md m-6"
            onSubmit={handleSubmit}
          >
            <h1 className="text-4xl font-bold text-amber-800 mb-2 text-center">
              Welcome to Snapfinity
            </h1>

            <p className="text-gray-600 text-center mb-2">
              Redefining the Social Experience.
            </p>

            <p className="font-sans text-2xl font-bold text-center text-amber-800">
              Access Account
            </p>

            <input
              className="border-2 border-black-700 p-2 rounded focus:outline-none focus:border-brown-400"
              name="email"
              value={form.email}
              autoComplete="current-email"
              onChange={handleChange}
              placeholder="Enter your Eamil"
            ></input>

            <input
              className="border-2 border-black-700 p-2 rounded focus:outline-none focus:border-brown-400"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              type="password"
            ></input>

            <button
              className="btn self-center bg-amber-800 rounded transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-amber-900 text-white w-[30%] h-10 "
              type="submit"
            >
              Log In
            </button>

            <p className="text-amber-800 font-sans text-center">
              New to Snapfinity?
              <Link to="/register" className="underline hover:text-amber-600">
                {" "}
                Sign Up
              </Link>
            </p>
          </form>
        </div>
        <div className="basis-2/3 hidden sm:flex flex items-center justify-center relative p-4 ">
          <div className="w-[600px] h-[600px] grid grid-cols-3 grid-rows-3 gap-2 relative ">
            {/* Top-left */}
            <img
              src="/Pics/Login1.png"
              alt="Login1"
              className="col-start-1 row-start-1 w-full h-full object-cover rounded-xl "
            />

            {/* Top-right */}
            <img
              src="/Pics/Login2.png"
              alt="Login2"
              className="col-start-3 row-start-1 w-full object-cover rounded-xl"
            />

            {/* Bottom-left */}
            <img
              src="/Pics/Login3.png"
              alt="Login3"
              className="col-start-1 row-start-3 w-full h-full object-cover rounded-xl"
            />

            {/* Bottom-right */}
            <img
              src="/Pics/Login4.png"
              alt="Login4"
              className="col-start-3 row-start-3 w-full h-full object-cover rounded-xl"
            />

            {/* Center image */}
            <img
              src="/Pics/Login5.png"
              alt="Login5"
              className="col-start-2 row-start-2 w-full h-full object-cover  border-white shadow-lg"
            />

            {/*  Top center */}
            <img
              src="/Pics/Login6.png"
              alt="Login6"
              className="col-start-2 row-start-1 w-full h-full object-cover  border-white shadow-lg"
            />

            {/* center first */}
            <img
              src="/Pics/Login7.png"
              alt="Login7"
              className="col-start-1 row-start-2 w-full h-full object-cover  border-white shadow-lg"
            />

            {/* center-last */}
            <img
              src="/Pics/Login8.png"
              alt="Login8"
              className="col-start-3 row-start-2 w-full h-full object-cover  border-white shadow-lg"
            />

            {/* last second */}
            <img
              src="/Pics/Login9.png"
              alt="Login9"
              className="col-start-2 row-start-3 w-full h-full object-cover  border-white shadow-lg"
            />
          </div>
        </div>
      </div>
      <div className=" flex items-center justify-center p-4">
        <p className="italic">
          "Snapfinity transformed the way I connect with my friends."
        </p>
        <p className="text-right text-sm font-semibold mt-2">– A Happy User</p>
      </div>
    </div>
  );
};
export default Login;
