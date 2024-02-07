import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Spinner } from "flowbite-react";

export default function DashPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  console.log(userPosts);
  const handleShowMore = async () => {
    try {
      setIsLoading(true);
      const startIndex = userPosts.length;
      const res = await fetch(
        `api/post/getPosts?userId=${currentUser?._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data?.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    const getUserPosts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`api/post/getPosts?userId=${currentUser?._id}`);
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
          setIsLoading(false);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      getUserPosts();
    }
  }, []);
  return isLoading ? (
    <div className="text-center m-auto text-2xl">
      <Spinner size="lg" /> <span className="pl-3">Loading..</span>
    </div>
  ) : (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 my-5">
      {currentUser?.isAdmin && userPosts?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head className="text-md">
              <Table.HeadCell>Date Modified</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {userPosts?.map((post) => {
              const updatedAt = new Date(post?.updatedAt);
              return (
                <Table.Body key={post?._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{updatedAt.toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                      <Link to={`post/${post?.slug}`}>
                        <img
                          className="w-20 h-10 object-cover bg-gray-500"
                          src={post?.image}
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-gray-300 ">
                      <Link to={`post/${post?.slug}`}>{post?.title}</Link>
                    </Table.Cell>
                    <Table.Cell>
                      {post?.category[0]?.toLocaleUpperCase() +
                        post?.category?.slice(1)}
                    </Table.Cell>
                    <Table.Cell className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete
                    </Table.Cell>
                    <Table.Cell className="font-medium text-blue-500 hover:underline cursor-pointer">
                      <Link to={`update-post/${post?._id}`}>Edit</Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
          {showMore &&
            (isLoading ? (
              <div className="text-center">
                <Spinner size="sm" /> <span className="pl-3">Loading..</span>
              </div>
            ) : (
              <div
                className="text-center font-medium text-sm my-3 cursor-pointer hover:underline text-blue-200"
                onClick={handleShowMore}
              >
                Show More
              </div>
            ))}
        </>
      ) : (
        <p>You do not have any posts yet</p>
      )}
    </div>
  );
}
