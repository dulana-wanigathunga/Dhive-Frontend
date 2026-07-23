import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import { formatNumber, getInitials, DEFAULT_AVATAR, onImageError } from "../util/index";
import moment from "moment";

export const RecentFollowerTable = ({ data, theme }) => {
  return (
    <TableContainer component={Paper} className="mb-20">
      <Table className="h-full " aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="font-bold">Follower</TableCell>
            <TableCell className="font-bold">Join Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} align="center">
                No Data Found.
              </TableCell>
            </TableRow>
          ) : (
            data.map(({ _id, createdAt, followerId: follower }) => (
              <TableRow
                key={_id}
                className={theme ? "text-gray-400" : "text-slate-600"}
              >
                <TableCell
                  component="th"
                  scope="row"
                  className="flex gap-2 items-center"
                >
                  {follower?.image ? (
                    <Avatar
                      src={follower.image || DEFAULT_AVATAR}
                      imgProps={{ onError: onImageError }}
                      alt={follower.name}
                    />
                  ) : (
                    <Avatar>{getInitials(follower.name)}</Avatar>
                  )}
                  <Box ml={2}>
                    <Typography variant="body1">{follower.name}</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" color="error">
                        {follower.accountType}
                      </Typography>
                      {follower.followers.length > 0 && (
                        <Typography variant="body2" fontWeight="bold">
                          {formatNumber(follower.followers.length)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{moment(createdAt).fromNow()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const RecentPostTable = ({ data, theme }) => {
  return (
    <TableContainer component={Paper} className="mb-20">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="font-bold">Post Title</TableCell>
            <TableCell className="font-bold">Views</TableCell>
            <TableCell className="font-bold">Post Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No Data Found.
              </TableCell>
            </TableRow>
          ) : (
            data?.map((el) => (
              <TableRow
                key={el?._id}
                className={theme ? "text-gray-400" : "text-slate-600"}
              >
                <TableCell
                  component="th"
                  scope="row"
                  className="flex gap-2 items-center"
                >
                  <Avatar src={el?.img} alt={el?.title} />
                  <Box ml={2}>
                    <Typography variant="body1">{el?.title}</Typography>
                    <Typography variant="caption" color="error">
                      {el?.category}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{formatNumber(el?.views.length)}</TableCell>
                <TableCell>{moment(el?.createdAt).fromNow()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
