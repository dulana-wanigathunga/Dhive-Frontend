import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";
import {
  Avatar,
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useHttpRequest from "../hooks/useHttpRequest";
import { formatNumber, getInitials, updateURL, DEFAULT_AVATAR, onImageError } from "../util";
import moment from "moment";
import { setFollowerData } from "../store/followerSlice";

const Followers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isDarkMode } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);
  // const [followers, setFollowers] = useState([]);
  const { isLoading, sendRequest } = useHttpRequest();

  const dispatch = useDispatch();

  const { followersData, numOfPages, totalFollowers, currentPage } =
    useSelector((state) => state.followers);

  useEffect(() => {
    if (user.isEmailVerified && followersData.length === 0) {
      const fetchFollowers = async () => {
        try {
          const result = await sendRequest(
            "POST",
            `posts/admin-followers?page=${page}`,
            null,
            {
              Authorization: `Bearer ${user.token}`,
            }
          );
          if (result) {
            dispatch(setFollowerData(result));
          }
        } catch (err) {
          console.log(err);
        }
      };

      fetchFollowers();
      updateURL({ page, navigate, location });
    }
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    setSearchParams({ page: value });
  };

  return (
    <div className="w-full flex flex-col ">
      <Typography
        variant="h6"
        className="text-slate-700 dark:text-white font-semibold"
        gutterBottom
      >
        Followers (
        <span className="text-sm">
          {followersData.length * currentPage +
            " of " +
            totalFollowers +
            " records"}
        </span>
        )
      </Typography>

      <TableContainer className="flex-1">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="dark:text-white">Name</TableCell>
              <TableCell className="dark:text-white">Account</TableCell>
              <TableCell className="dark:text-white">Followers</TableCell>
              <TableCell className="dark:text-white">Joined Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {followersData?.map(({ _id, followerId, createdAt }) => (
              <TableRow key={_id} className="text-slate-600 dark:text-white ">
                <TableCell className="flex gap-2 items-center">
                  {followerId.image ? (
                    <Avatar
                      src={followerId.image || DEFAULT_AVATAR}
                      imgProps={{ onError: onImageError }}
                      alt={followerId.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <Avatar className="w-10 h-10 rounded-full bg-indigo-700 text-white">
                      {getInitials(followerId.name)}
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>
                  <Typography
                    className={`${
                      followerId?.accountType === "User"
                        ? "bg-rose-800 text-rose-800"
                        : "bg-blue-800 text-blue-800"
                    } bg-opacity-30 dark:text-white font-semibold px-4 py-1 rounded-full w-fit`}
                  >
                    {followerId?.accountType}
                  </Typography>
                </TableCell>
                <TableCell>
                  <div className="flex dark:text-white  gap-1 items-center">
                    {formatNumber(followerId?.followers.length ?? 0)}
                  </div>
                </TableCell>
                <TableCell className="dark:text-white ">
                  {moment(createdAt).fromNow()}
                </TableCell>
              </TableRow>
            ))}
            {followersData?.length < 1 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  className="dark:text-white"
                >
                  No Data Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="w-full mt-5 flex items-center justify-center">
        <Pagination
          count={numOfPages}
          onChange={handlePageChange}
          size="large"
          color="primary"
          sx={{
            "& .MuiPaginationItem-root": {
              color: `${isDarkMode ? "white" : ""}`,
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: `${isDarkMode ? "white" : "#1f2937"}`, // Customize the background color for selected item
              color: `${isDarkMode ? "black" : "primary"}`, // Ensure text color is readable against the background
              borderRadius: "50%", // Optional: Make the selected item a circle
            },
          }}
        />
      </div>

      {isLoading && <LoadingSpinner />}

      <Toaster position="bottom-right" />
    </div>
  );
};

export default Followers;
