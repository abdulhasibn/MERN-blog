import React from "react";
import { useSelector } from "react-redux";
import { TextInput, Button } from "flowbite-react";
export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-3xl my-7 text-center">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 rounded-full self-center shadow-md overflow-hidden">
          <img
            src={currentUser?.profilePicture}
            alt="Profile Picture"
            className="rounded-full w-full h-full border-8 border-[lightgray] object-cover cursor-pointer"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser?.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser?.email}
        />
        <TextInput type="password" id="password" placeholder="Password" />

        <Button type="submit" outline gradientDuoTone="purpleToBlue">
          Update
        </Button>
        <div className="flex justify-between">
          <span className="text-red-500 cursor-pointer">Delete Account</span>
          <span className="text-red-500 cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  );
}
