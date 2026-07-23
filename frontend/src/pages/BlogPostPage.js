import React, { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import PostComments from "../components/PostComments";
import PostRequests from "../apis/postApi";
import LoadingSpinner from "../components/LoadingSpinner";
import { DEFAULT_AVATAR, onImageError } from "../util";

const BlogPostPage = () => {
  const { getPost, isLoading, getComments } = PostRequests();

  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);

  const { id } = useParams();

  if (!post || !comments) {
    <LoadingSpinner />;
  }

  const fetchComments = async () => {
    try {
      const result = await getComments(id);

      if (result.success) {
        setComments(result.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await getPost(id);

        if (result.success) {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          setPost(result.data);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  if (!post || !comments) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      {post && (
        <div className="w-full px-5  flex flex-col items-center">
          <img
            src={post?.img}
            alt={post?.title}
            className="w-full h-[300px] md:h-[460px] object-cover object-center rounded mb-8"
          />
          <div className="w-full  flex flex-col gap-5">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white ">
              {post?.title}
            </h1>

            <div className="w-full flex items-center gap-10">
              <span className=" font-semibold text-sky-500">
                {post?.category}
              </span>
              <span className="flex gap-4 items-baseline text-xl font-medium text-slate-700 dark:text-gray-400">
                {post?.views?.length}
                <span className="text-base text-sky-500 font-semibold">
                  Views
                </span>
              </span>
            </div>

            <Link
              to={`/writer/${post?.user?._id}`}
              className="flex gap-3 items-center"
            >
              <img
                src={post?.user?.image || DEFAULT_AVATAR}
                onError={onImageError}
                alt={post?.user?.name}
                className="object-cover w-12 h-12 rounded-full"
              />
              <div className="text-start">
                <p className="text-slate-800 dark:text-white font-medium">
                  {post?.user?.name}
                </p>
                <span className="text-slate-600 text-sm dark:text-white">
                  {new Date(post?.createdAt).toDateString()}
                </span>
              </div>
            </Link>
          </div>

          <div className=" dark:text-white  xl:w-full flex flex-col text-justify justify-center text-black  mt-10">
            {post?.description && (
              <Markdown
                options={{ wrapper: "article" }}
                className="leading-[3rem] text-base 2xl:text-[20px]"
              >
                {post?.description}
              </Markdown>
            )}

            {post && (
              <div className="w-full ">
                {
                  <PostComments
                    postId={post._id}
                    comments={comments}
                    callGetComments={fetchComments}
                  />
                }
              </div>
            )}
          </div>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
    </Layout>
  );
};

export default BlogPostPage;
