import React from "react";
import { Link } from "react-router-dom";
import { Label, TextInput, Button } from "flowbite-react";

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link
            to="/"
            className="self-center whitespace-nowrap font-semibold dark:text-white text-4xl"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Hasib's
            </span>{" "}
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a project done to get familiarized with developing apps in
            MERN stack
          </p>
        </div>
        {/*right*/}
        <div className="flex-1">
          <form className="flex flex-col gap-5">
            <div className="">
              <Label value="Name" />
              <TextInput type="text" placeholder="eg: Abdul Hasib" />
            </div>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="eg: abdulhasib@example.com"
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput type="password" placeholder="password" />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              Submit
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account already ?</span>
            <Link to="sing-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
