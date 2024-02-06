import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div>
      {currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to={"/"} />}
    </div>
  );
}
