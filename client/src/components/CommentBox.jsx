import React, { useState } from "react";
import { Button } from "flowbite-react";
import { useSelector } from "react-redux";

export default function CommentBox() {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <div className="flex gap-2 max-w-3xl w-full text-sm">
        Signed in as :
        <span>
          <img
            src={currentUser?.profilePicture}
            className="w-7 h-7 rounded-full"
          />
        </span>
        <span className="text-teal-600">@{currentUser?.username}</span>
      </div>

      <div className="border mt-3 rounded-lg border-gray-400 p-5 ">
        <form className="flex flex-col gap-5">
          <textarea
            name="comment"
            id="comment"
            className="w-full bg-gray-100 text-sm rounded-md border border-gray-400 font-serif"
            placeholder="Add a comment..."
            onChange={handleCommentChange}
          ></textarea>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">
              {200 - comment.length} characters remaining
            </span>
            <Button gradientDuoTone={"purpleToBlue"} outline>
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
