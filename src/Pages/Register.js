import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setform] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();
    const [alert, setalert] = useState({show:'',msg:'',type:''});

  const handleChange = (e) =>
    setform({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, form);
      setalert({show:'true',type: 'Success',msg:'Signed in Successfully. Login to continue'});
      setTimeout(() => {
         navigate("/login");
      }, 1500);
     
    } catch (error) {
       setalert({show:'true',type: 'Error',msg:"Registration failed. Please try again."});
    }
  };

  return (
    <div className="brownbackground">
                  {alert.show && (
  <div className={`alert` } style={{backgroundColor : '#C7B7A3' , color : 'black'}} role="alert">
    {`${alert.type} : ${alert.msg}`}
  </div>
)}
    <div className="brownbackground  min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
       className="flex flex-col whitebackground gap-4 shadow-[0_4px_30px_rgba(255,255,255,0.5)] p-8 rounded-xl w-[95%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%]"

      >
        <h1 className="text-4xl font-bold text-amber-800 mb-2 text-center">
          Welcome to Snapfinity
        </h1>

        <p className="text-gray-600 text-center mb-2">
          Redefining the Social Experience.
        </p>

        <p className="font-sans text-2xl font-bold text-center text-amber-800">
          Create Account
        </p>

        <input
          className="border-2 border-black-700 p-2 rounded focus:outline-none focus:border-brown-400"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter Username"
        />

        <input
          className="border-2 border-black-700 p-2 rounded focus:outline-none focus:border-brown-400"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter Email"
        />

        <input
          className="border-2 border-black-700 p-2 rounded focus:outline-none focus:border-brown-400"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter Password"
          type="password"
        />

        <button
          className="btn self-center bg-amber-800 rounded transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-amber-900 text-white w-[40%] h-10"
          type="submit"
        >
          Register
        </button>

        <p className="text-amber-800 text-sm text-center mt-2">
          Already have an account?{" "}
          <Link to="/" className="underline hover:text-amber-600">
            Log in
          </Link>
        </p>
      </form>
    </div>
    </div>
  );
};

export default Register;
