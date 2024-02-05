import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowRight } from "react-icons/hi";
import { useDispatch } from "react-redux";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../redux/user/userSlice";
import { signOut } from "./DashProfile/utils/signOut";
export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div>
      <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-2">
            <Link to={"/dashboard?tab=profile"}>
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                label="User"
                labelColor="dark"
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>
            <Link to={"/sign-in"}>
              <Sidebar.Item
                icon={HiArrowRight}
                labelColor="dark"
                as="div"
                onClick={() =>
                  signOut(
                    dispatch,
                    signOutStart,
                    signOutFailure,
                    signOutSuccess
                  )
                }
              >
                Sign Out
              </Sidebar.Item>
            </Link>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
