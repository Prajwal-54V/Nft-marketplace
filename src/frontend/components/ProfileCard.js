import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Box, MenuItem, Menu, IconButton } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRight: theme.spacing(1),
    // backgroundColor: "#f00",
    height: "30px",
    width: "30px",
  },
  circle: {
    height: "20px",
    width: "20px",
  },
  container: {
    height: "50px",
    width: "50px",
  },
}));

const ProfileCard = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const alert = useAlert();
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = () => {
    alert.info("logout success");
    navigate("/");
    window.location.reload();
  };
  const showProfile = () => {
    navigate("/profile");
  };

  return (
    <div className={classes.container}>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Avatar className={classes.avatar}>
          <AccountCircle className={classes.circle} />
        </Avatar>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <Box px={2}>
          <MenuItem
            onClick={(e) => {
              handleClose();
              showProfile();
            }}
          >
            Profile
          </MenuItem>
          {/* <MenuItem onClick={handleClose}>Account Details</MenuItem> */}
          <MenuItem
            onClick={(e) => {
              handleClose();
              logout();
            }}
          >
            Logout
          </MenuItem>
        </Box>
        {/* <Box borderTop="1px solid #eee" py={1}>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Box> */}
      </Menu>
    </div>
  );
};

export default ProfileCard;
