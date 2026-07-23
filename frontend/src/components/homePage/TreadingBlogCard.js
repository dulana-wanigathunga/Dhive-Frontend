import React from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { usePopularPosts } from "../../hooks/postHook";
import LoadingSpinner from "../LoadingSpinner";
import { DEFAULT_AVATAR, onImageError } from "../../util";

const TreadingBlogCard = () => {
  const { popularPosts, isLoading } = usePopularPosts();
  const refCards = React.useRef(null);
  const isInViewCards = useInView(refCards, { once: false });

  return (
    <div className="mt-10 flex flex-col justify-center items-center">
      <div>
        <motion.h2
          className="font-bold text-slate-800 dark:text-white container text-center mb-20 px-2 lg:p-0 md:p-0 xl:p0 2xl:p-0 text-4xl md:text-5xl"
          initial={{ opacity: 0, y: -50 }}
          animate={
            isInViewCards ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }
          }
          transition={{ duration: 0.5 }}
        >
          What is Trending?
        </motion.h2>
        <motion.article
          ref={refCards}
          className="flex cursor-pointer flex-col xl:flex-row p-2 lg:p-0 md:p-0 xl:p-0 2xl:p-0 gap-10"
          initial="hidden"
          animate={isInViewCards ? "visible" : "hidden"}
          transition={{ staggerChildren: 0.3 }}
        >
          {popularPosts?.map(({ createdAt, slug, user, _id, title, img }) => (
            <motion.div
              key={_id}
              className="relative transform transition-transform duration-300 hover:scale-105 shadow-xl shadow-gray-700 h-80 w-full xl:w-1/3 rounded-2xl flex flex-col justify-end px-4 py-3 bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: `url(${img})` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isInViewCards ? 1 : 0,
                scale: isInViewCards ? 1 : 0.8,
              }}
            >
              <Link to={`blog/${slug}/${_id}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-sky-700/0 rounded-lg"></div>
                <div className="relative z-10 flex items-center text-sm md:text-sm lg:text-xs text-gray-300 mb-2">
                  <span className="xl:w-36 w-36">
                    {new Date(createdAt)
                      .toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })
                      .replace(",", ",\u00A0")}
                  </span>
                  <div className="flex items-center w-full lg:gap-2 gap-3">
                    <img
                      className="rounded-full object-cover h-8 w-8 xl:h-6 xl:w-6"
                      src={user.image || DEFAULT_AVATAR}
                      onError={onImageError}
                      alt="profile"
                    />
                    <p className="text-white">{user.name}</p>
                  </div>
                </div>
                <h3 className="relative mb-3 sm:mb-0 z-10 h-8 text-xl xl:text-lg font-semibold leading-6 text-white group-hover:text-gray-300">
                  {title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </motion.article>
      </div>

      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default TreadingBlogCard;
