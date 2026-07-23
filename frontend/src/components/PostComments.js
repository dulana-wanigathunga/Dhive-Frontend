import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import PostRequests from "../apis/postApi";
import LoadingSpinner from "./LoadingSpinner";
import Button from "./Button";
import Profile from "../assets/profile.png";
import { onImageError } from "../util";
import ConfirmationModal from "./ConfirmationModal";

const PostComments = ({ postId, comments, callGetComments }) => {
  const { user } = useSelector((state) => state.user);
  const { isLoading, deleteComments, postComments, updateComment } =
    PostRequests();
  const [comment, setComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleDeleteComment = async (id) => {
    try {
      const result = await deleteComments(id, user.token, postId);
      if (result.success) {
        callGetComments();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("An error occurred when deleting", error);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    try {
      const result = await postComments(postId, user.token, { comment });
      if (result.success) {
        setComment("");
        callGetComments();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditComment = async (e) => {
    e.preventDefault();
    try {
      const result = await updateComment(editCommentId, user.token, {
        editComment,
      });
      if (result.success) {
        callGetComments();
        setEditCommentId(null);
        setEditComment("");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const startEditComment = (commentId, currentComment) => {
    setEditCommentId(commentId);
    setEditComment(currentComment);
  };

  const cancelEditComment = () => {
    setEditCommentId(null);
    setEditComment("");
  };

  const openModal = (commentId) => {
    setCommentToDelete(commentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCommentToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    handleDeleteComment(commentToDelete);
    closeModal();
  };

  return (
    <div className="w-full py-10">
      <p className="text-lg font-semibold text-slate-700 dark:text-white mb-6">
        Post Comments
      </p>

      {user?.token ? (
        <form onSubmit={handlePostComment} className="flex flex-col mb-6">
          <textarea
            name="comment"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            required={true}
            placeholder="Add a comment..."
            className="bg-transparent w-full p-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-blue-600 rounded"
          ></textarea>
          <div className="w-full flex justify-end mt-2">
            <Button
              type="submit"
              label="Submit"
              styles="bg-slate-950 text-white px-10 py-2.5 rounded-full text-center outline-none"
            />
          </div>
        </form>
      ) : (
        <Link to="/login" className="flex flex-col py-10">
          <Button
            label="Sign in to comment"
            styles="bg-slate-950 text-white px-8 py-1.5 rounded-full text-center outline-none"
          />
        </Link>
      )}

      <div className="w-full h-full flex flex-col gap-10 2xl:gap-y-14 px-2">
        {user && comments?.length === 0 ? (
          <span className="text-base text-slate-600 dark:text-white">
            No Comment, be the first to commenter
          </span>
        ) : (
          comments?.map((el) => (
            <div key={el?._id} className="w-full flex gap-4 items-start">
              <img
                src={el?.user?.image || Profile}
                onError={onImageError}
                alt={el?.user?.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="w-full -mt-2">
                <div className="w-full flex items-center gap-2">
                  <p className="text-slate-700 dark:text-white font-medium">
                    {el?.user?.name}
                  </p>
                  <span className="text-slate-700 dark:text-white text-xs italic">
                    {new Date(el?.createdAt).toDateString()}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {editCommentId === el?._id ? (
                    <form
                      onSubmit={handleEditComment}
                      className="flex flex-col w-full"
                    >
                      <textarea
                        name="editComment"
                        onChange={(e) => setEditComment(e.target.value)}
                        value={editComment}
                        required={true}
                        className="bg-transparent w-full p-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-blue-600 rounded"
                      ></textarea>
                      <div className="w-full flex justify-end mt-2 gap-2">
                        <Button
                          type="submit"
                          label="Update"
                          styles="bg-slate-950 text-white px-10 py-2.5 rounded-full text-center outline-none"
                        />
                        <Button
                          type="button"
                          label="Cancel"
                          onClick={cancelEditComment}
                          styles="bg-gray-600 text-white px-10 py-2.5 rounded-full text-center outline-none"
                        />
                      </div>
                    </form>
                  ) : (
                    <span className="text-lg">{el?.comment}</span>
                  )}

                  {user?.id === el?.user?._id && (
                    <div className="flex gap-2">
                      {editCommentId !== el?._id && (
                        <>
                          <span
                            className="text-base text-red-600 cursor-pointer"
                            onClick={() => openModal(el?._id)}
                          >
                            Delete
                          </span>
                          <span
                            className="text-base text-blue-600 cursor-pointer"
                            onClick={() =>
                              startEditComment(el?._id, el?.comment)
                            }
                          >
                            Edit
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {isLoading && <LoadingSpinner />}
      <Toaster position="bottom-right" />

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this comment?"
        onConfirm={confirmDelete}
        onCancel={closeModal}
      />
    </div>
  );
};

export default PostComments;
