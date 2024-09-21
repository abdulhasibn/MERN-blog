import React from "react";
import moment from "moment";
import { HiHandThumbUp } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { FaUserAlt } from "react-icons/fa";

const Comment = ({
  imgUrl,
  username,
  createdAt,
  content,
  likes,
  userId,
  commentId,
}) => {
  const { currentUser } = useSelector((state) => state.user);
  const handleLikeButtonClick = async () => {
    try {
      const res = await fetch(
        `/api/comment/updateLikeForComments?userId=${currentUser?._id}&commentId=${commentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex gap-3 items-center border-b border-slate-300 pb-3">
      {imgUrl ? (
        <img
          src={imgUrl}
          alt="Profile Picture"
          className="w-10 h-10 rounded-full"
        />
      ) : (
        <FaUserAlt size={30} />
      )}
      <div>
        <div className="flex flex-col">
          <div className="flex gap-3">
            <div className="font-bold">@{username || "sample"}</div>
            <div>{moment(createdAt).fromNow()}</div>
          </div>
          <div>{content || "Sample text"}</div>
        </div>

        <div className="flex gap-2 items-center">
          <HiHandThumbUp
            className="text-slate-500"
            onClick={handleLikeButtonClick}
          />
          <div className="text-slate-400">{likes} likes</div>
          {currentUser?._id === userId && (
            <div className="flex gap-2 text-blue-500">
              <p>Edit</p>
              <p>Delete</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
