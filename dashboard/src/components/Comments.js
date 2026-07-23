import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenComments } from "../store/commentsSlice";
import useHttpRequest from "../hooks/useHttpRequest";
import LoadingSpinner from "./LoadingSpinner";
import { DEFAULT_AVATAR, onImageError } from "../util";

const Comments = () => {
  const { openComment, commentId } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.user);
  const { isLoading, sendRequest } = useHttpRequest();
  const [commentsData, setCommentsData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentData = await sendRequest(
          "GET",
          `posts/comments/${commentId}`
        );
        setCommentsData(commentData.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (commentId) {
      fetchComments();
    }
  }, [commentId, sendRequest]);

  const handleClose = () => {
    dispatch(setOpenComments(false));
  };

  const handleDelete = async (id) => {
    try {
      await sendRequest("DELETE", `posts/comments/${id}/${commentId}`, null, {
        Authorization: `Bearer ${user.token}`,
      });

      // Remove the deleted comment from the commentsData state
      setCommentsData((prevComments) =>
        prevComments.filter((comment) => comment._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl mx-auto dark:bg-slate-700 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex dark:text-white justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold ">
            Comments ({commentsData.length || 0})
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={handleClose}
          >
            <MdClose className="dark:text-white" size={24} />
          </button>
        </div>
        <div
          className="p-4 space-y-4"
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          {commentsData.map(({ _id, user, comment, createdAt }) => (
            <div key={_id} className="flex gap-4">
              <img
                src={user?.image || DEFAULT_AVATAR}
                onError={onImageError}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="w-full ">
                <div className="flex justify-between items-center">
                  <div className=" flex  justify-center items-center gap-2">
                    <span className=" dark:text-white   font-medium text-gray-600 ">
                      {user.name}
                    </span>
                    <span className=" dark:text-white text-xs italic text-gray-700 ">
                      {new Date(createdAt).toDateString()}
                    </span>
                  </div>
                  <span
                    className="text-sm bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold px-4 py-1.5 cursor-pointer"
                    onClick={() => handleDelete(_id)}
                  >
                    Delete
                  </span>
                </div>
                <p className=" dark:text-white text-sm text-gray-700 ">
                  {comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default Comments;
