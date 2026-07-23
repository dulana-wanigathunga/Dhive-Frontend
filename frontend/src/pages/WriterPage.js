import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { formatNumber } from "../util/index";
import NoProfile from "../assets/profile.png";
import { onImageError } from "../util";
import Button from "../components/Button";
import { FaUserCheck } from "react-icons/fa";
import { WritersBlog } from "../components/WritersBlog";
import PopularPosts from "../components/PopularPosts";
import { Pagination } from "@mui/material";
import { usePopularPosts, usePost } from "../hooks/postHook";
import UserRequests from "../apis/userApi";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const WriterPage = () => {
  const { user, isDarkMode } = useSelector((state) => state.user);
  const [writer, setWriter] = useState(null);
  const { id } = useParams();
  const { posts, numOfPages, setPage } = usePost({ WriterId: id });
  const { popularPosts } = usePopularPosts();
  const { getWriterInfo, followWriter, unFollowWriter, isLoading } =
    UserRequests();

  const fetchWriter = async () => {
    try {
      const result = await getWriterInfo(id);

      if (result.success) {
        setWriter(result.data);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWriter();
  }, [id]);

  const handleFollow = async () => {
    try {
      const result = await followWriter(id, user.token);
      if (result.success) {
        fetchWriter();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUnFollow = async () => {
    try {
      const result = await unFollowWriter(id, user.token);
      if (result.success) {
        fetchWriter();
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Check if writer exists
  if (!writer || !popularPosts || !posts) {
    return <LoadingSpinner />;
  }

  const isFollowing =
    user &&
    writer.followers.some((follower) => follower.followerId._id === user.id);

  return (
    <Layout>
      <div>
        {/* Top Section */}
        <div className="w-full md:h-60 flex  flex-col gap-5 items-center md:flex-row bg-slate-900 dark:bg-gradient-to-r from-[#020b19] via-[#071b3e] to-[#020b19] mt-5 mb-10 rounded-md p-5 md:px-20">
          <img
            src={writer?.image || NoProfile}
            onError={onImageError}
            alt="Writer"
            className="w-48 h-48 rounded-full border-4 border-slate-400 object-cover"
          />
          {/* Writer Info */}
          <div className="w-full h-full flex flex-col gap-y-5 md:gap-y-8 items-center justify-center">
            <h2 className="text-white text-4xl 2xl:text-5xl font-bold">
              {writer?.name}
            </h2>

            <div className="flex gap-10">
              <div className="flex flex-col items-center">
                <p className="text-gray-300 text-2xl font-semibold">
                  {writer && formatNumber(writer?.followers?.length ?? 0)}
                </p>
                <span className="text-gray-500">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-gray-300 text-2xl font-semibold">
                  {formatNumber(posts?.length ?? 0)}
                </p>
                <span className="text-gray-500">Posts</span>
              </div>
            </div>
            {/* Follow Button */}
            {user && user.id !== writer._id && user?.token && (
              <div>
                {!isFollowing ? (
                  <Button
                    label="Follow"
                    onClick={handleFollow}
                    styles="text-slate-800 text-semibold md:-mt-4 px-6 py-1 rounded-full bg-white"
                  />
                ) : (
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center gap-2 text-white text-semibold md:-mt-4 px-6 py-1 rounded-full border">
                      <span>Following</span>
                      <FaUserCheck />
                    </div>
                    <Button
                      label="Unfollow"
                      type="button"
                      onClick={handleUnFollow}
                      styles="bg-red-700 text-white text-semibold md:-mt-4 px-6 py-1 rounded-full  "
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Main Content Section */}
        <div className=" md:flex fle-col">
          {/* Left Column */}
          <div className="w-full md:w-5/6 flex  flex-col gap-y-28 md:gap-y-14 ">
            {posts?.length === 0 ? (
              <div className="w-full h-full py-8 flex justify-center">
                <span className="text-lg text-slate-500">
                  No Post Available
                </span>
              </div>
            ) : (
              <>
                {posts.map((post, index) => (
                  <WritersBlog key={post._id + index} post={post} />
                ))}
                <div className="w-full flex  items-center mb-10 justify-center">
                  {/* Pagination Component Here */}
                  <Pagination
                    count={numOfPages}
                    onChange={(event, value) => setPage(value)}
                    size="large"
                    color="primary"
                    sx={{
                      "&   .MuiPaginationItem-root": {
                        color: `${isDarkMode ? "white" : ""}`,
                      },
                    }}
                  />
                </div>
              </>
            )}
          </div>
          {/* Right Column */}
          <div className="w-full    items-center md:w-1/3 flex flex-col gap-y-12">
            {/* Popular Posts Component */}
            <PopularPosts posts={popularPosts} />
          </div>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
      <Toaster position="bottom-right" />
    </Layout>
  );
};

export default WriterPage;
