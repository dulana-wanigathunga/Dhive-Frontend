import React, { useState } from "react";
import images from "../assets";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import { setIsLoading, signOut, toggleMode } from "../store/userSlice";
import { MdWbSunny } from "react-icons/md";
import { RiCloseLine } from "react-icons/ri";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { CiLogout } from "react-icons/ci";
import { Box, ListItemIcon, Menu, MenuItem } from "@mui/material";
import LoadingSpinner from "./LoadingSpinner";
import Button from "../components/Button";
import { FaUser } from "react-icons/fa";
import { DEFAULT_AVATAR, onImageError } from "../util";

const Header = () => {
  const { user, isDarkMode, isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
  }));

  const navItems = [
    { path: "/", link: "Home" },
    { path: "/about", link: "About" },
    {
      path: process.env.REACT_APP_DASHBOARD_URL,
      link: `${
        user && user.accountType === "Writer" ? "Dashboard " : "Write article ?"
      }`,
      external: true,
    },
  ];

  const toggleModeHandler = () => {
    dispatch(toggleMode());
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSignOut = () => {
    dispatch(setIsLoading(true));
    dispatch(signOut());
    setTimeout(() => {
      dispatch(setIsLoading(false));
    }, 2000);
  };

  function getInitials(fullName) {
    if (!fullName) {
      return "";
    }
    const names = fullName.split(" ");
    const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());
    return initials.join("");
  }

  function getFirstName(fullName) {
    if (!fullName) {
      return "";
    }
    const names = fullName.split(" ");
    return names[0];
  }

  const UserMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Box
          sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          className="w-32 font-Poppins "
        >
          <IconButton
            disableRipple
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            {user?.image ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  alt="User Avatar"
                  className="size-9 xs:size-11"
                  src={user.image || DEFAULT_AVATAR}
                  imgProps={{ onError: onImageError }}
                />
              </StyledBadge>
            ) : (
              <Avatar className="size-9 xs:size-11">
                {getInitials(user?.name)}
              </Avatar>
            )}
          </IconButton>
          <div className="mx-2 text-sm dark:text-white">
            <p className="font-medium">{getFirstName(user?.name)}</p>
          </div>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem>
            <Link to="/profile">
              <ListItemIcon>
                <FaUser />
              </ListItemIcon>
              Profile
            </Link>
          </MenuItem>
          <MenuItem onClick={handleSignOut} style={{ color: "red" }}>
            <ListItemIcon style={{ color: "red" }}>
              <CiLogout />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </>
    );
  };

  return (
    <header className="h-20  w-full flex justify-between items-center relative">
      <div>
        <Badge color="primary" badgeContent={"Beta"}>
          <Link to={"/"}>
            <img
              src={images.Logo}
              className="w-28 h-10  dark:bottom-0 border rounded-2xl border-slate-700"
              alt="logo"
            />
          </Link>
        </Badge>
      </div>
      <div>
        <ul className="w-full sm:flex gap-8 justify-center hidden items-center">
          {navItems.map((item, index) =>
            item.external ? (
              <li key={index}>
                <a href={item.path} target="_blank" rel="noopener noreferrer">
                  {item.link}
                </a>
              </li>
            ) : (
              <li key={index}>
                <Link to={item.path}>{item.link}</Link>
              </li>
            )
          )}
          <IconButton onClick={toggleModeHandler} className="mx-2">
            {isDarkMode ? (
              <MdWbSunny className="h-full size-6 dark:text-white text-black font-bold" />
            ) : (
              <BsFillMoonStarsFill className="size-6 font-bold text-black dark:text-white" />
            )}
          </IconButton>
          {user ? (
            user.isEmailVerified ? (
              <UserMenu />
            ) : (
              <Link to="/otp-verification" state={{ from: "/" }}>
                <Button
                  label="Verify Email"
                  type="button"
                  styles="dark:bg-sky-700 bg-slate-950  text-white px-8 py-1.5 rounded-full text-center"
                />
              </Link>
            )
          ) : (
            <Link to="/login">
              <Button
                type="button"
                label="Sign in"
                styles="dark:bg-sky-500 hover:bg-sky-700 bg-slate-950 text-white px-8 py-1.5 rounded-full text-center outline-none"
              />
            </Link>
          )}
        </ul>
        <div className="px-4">
          <GiHamburgerMenu
            className="size-6 sm:hidden cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>
      </div>
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-50"
            onClick={closeSidebar}
          ></div>
          <div
            className={`fixed top-0 right-0  h-full bg-white w-64 dark:bg-slate-800 shadow-lg transform translate-x-0 transition-transform ease-in-out duration-300 z-50`}
          >
            <div className="flex justify-end px-5 h-20 mt-8">
              <RiCloseLine
                className="text-white cursor-pointer text-2xl"
                onClick={closeSidebar}
              />
            </div>
            <ul className="flex flex-col gap-7 w-full items-center text-black font-normal dark:text-white">
              {user ? (
                !user.isEmailVerified ? (
                  <Link to="/otp-verification" state={{ from: "/" }}>
                    <Button className="dark:bg-sky-700 bg-slate-950 text-white px-8 py-1.5 rounded-full text-center outline-none">
                      Verify Email
                    </Button>
                  </Link>
                ) : (
                  <>
                    <li>
                      {user.image ? (
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                        >
                          <Avatar
                            alt="User Avatar"
                            className="size-14"
                            src={user.image || DEFAULT_AVATAR}
                            imgProps={{ onError: onImageError }}
                          />
                        </StyledBadge>
                      ) : (
                        <Avatar className="size-9 xs:size-11">
                          {getInitials(user.name)}
                        </Avatar>
                      )}
                    </li>
                    <li className="mx-2 text-balance dark:text-white">
                      <p className="font-medium">{user.name}</p>
                    </li>
                  </>
                )
              ) : null}
              {navItems.map((item, index) =>
                item.external ? (
                  <li key={index}>
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeSidebar}
                    >
                      {item.link}
                    </a>
                  </li>
                ) : (
                  <li key={index}>
                    <Link to={item.path} onClick={closeSidebar}>
                      {item.link}
                    </Link>
                  </li>
                )
              )}
              <li>
                <IconButton onClick={toggleModeHandler} className="mx-2">
                  {isDarkMode ? (
                    <MdWbSunny className="h-full size-6 dark:text-white text-black font-bold" />
                  ) : (
                    <BsFillMoonStarsFill className="size-6 font-bold text-black dark:text-white" />
                  )}
                </IconButton>
              </li>

              {user ? (
                <Button
                  icon={<CiLogout />}
                  onClick={handleSignOut}
                  type="button"
                  label="Logout"
                  styles="dark:bg-red-500 hover:bg-sky-700 flex items-center gap-2 bg-slate-950 text-white px-5 py-2.5 rounded-full text-center outline-none"
                />
              ) : (
                <Link to="/login">
                  <Button
                    type="button"
                    label="Sign In"
                    styles="dark:bg-sky-500 hover:bg-sky-700 bg-slate-950 text-white px-8 py-1.5 rounded-full text-center outline-none"
                  />
                </Link>
              )}
            </ul>
          </div>
        </>
      )}
      {isLoading && <LoadingSpinner />}
    </header>
  );
};

export default Header;
