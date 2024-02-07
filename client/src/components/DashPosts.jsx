import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Button } from "flowbite-react";

export default function DashPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const getUserPosts = async () => {
      try {
        const res = await fetch(`api/post/getPosts?userId=${currentUser._id}`);
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      getUserPosts();
    }
  }, []);
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && userPosts.length > 0 ? (
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
            {userPosts.map((post) => {
              const updatedAt = new Date(post.updatedAt);
              return (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{updatedAt.toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                      <Link to={`post/${post.slug}`}>
                        <img
                          className="w-20 h-10 object-cover bg-gray-500"
                          src={post.image}
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-gray-300 ">
                      <Link to={`post/${post.slug}`}>{post.title}</Link>
                    </Table.Cell>
                    <Table.Cell>
                      {post.category[0].toLocaleUpperCase() +
                        post.category.slice(1)}
                    </Table.Cell>
                    <Table.Cell className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete
                    </Table.Cell>
                    <Table.Cell className="font-medium text-blue-500 hover:underline cursor-pointer">
                      <Link to={`update-post/${post._id}`}>Edit</Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
        </>
      ) : (
        <p>You do not have any posts yet</p>
      )}
    </div>
  );
}
