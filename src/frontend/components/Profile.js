import React from "react";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
} from "@material-ui/core";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "bottom",
    height: "87vh",
  },
  card: {
    width: "50vw",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
    overflow: "scroll",
  },
  cardHeader: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  cardContent: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  email: {
    marginBottom: 10,
  },
  wallet: {
    marginTop: 20,
  },
  account: {
    fontWeight: "bold",
  },
  avatar: {
    width: 80,
    height: 80,
    margin: "0 auto",
    marginBottom: 20,
  },
  admin: {
    marginTop: 5,
    fontWeight: "bold",
  },
  balance: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formControl: {
    marginTop: 20,
    width: "100%",
  },
  button: {
    marginTop: 20,
  },
});
export default function Profile({ account, user, setUser, setAccount }) {
  const [balance, setBalance] = useState("");
  const [walletAccountNumber, setWalletAccountNumber] = useState(
    user.metasMaskAcc
  );
  const [isEditing, setIsEditing] = useState(false);
  const alert = useAlert();
  const classes = useStyles();

  const updateBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const temp = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(temp));
  };
  const handleSave = async () => {
    setIsEditing(false);
    try {
      const response = await axios.post(
        `http://localhost:4000/updateUser/${user._id}`,
        { newAccount: walletAccountNumber }
      );

      if (response.status === 200) {
        setUser(response.data.updatedUser);
        setAccount(walletAccountNumber);
        alert.success("account updated");
      } else {
        console.log(response.data);
        throw new Error("fail to update user");
      }
    } catch (err) {
      setWalletAccountNumber(user.metasMaskAcc);
      alert.info("failed to update user");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setWalletAccountNumber(user.metasMaskAcc);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (event) => {
    setWalletAccountNumber(event.target.value);
  };
  useEffect(() => {
    updateBalance();
  }, []);
  return (
    // <div className={classes.container}>
    //   <Card className={classes.card}>
    //     <CardHeader className={classes.cardHeader} title="Profile" />
    //     <CardContent className={classes.cardContent}>
    //       <Avatar className={classes.avatar} src={user.img} />
    //       <Typography className={classes.name}>{user.name}</Typography>
    //       <Typography className={classes.email}>{user.email}</Typography>
    //       <Typography className={classes.admin}>Admin:</Typography>
    //       <Typography>{user.isAdmin ? "True" : "False"}</Typography>
    //       {isEditing ? (
    //         <div className={classes.form}>
    //           <TextField
    //             className={classes.formControl}
    //             label="Wallet Account Number"
    //             value={walletAccountNumber}
    //             onChange={handleChange}
    //           />
    //           <Button
    //             className={classes.button}
    //             variant="contained"
    //             color="primary"
    //             onClick={handleSave}
    //           >
    //             Save
    //           </Button>
    //           <Button
    //             className={classes.button}
    //             variant="contained"
    //             color="secondary"
    //             onClick={handleCancel}
    //           >
    //             Cancel
    //           </Button>
    //         </div>
    //       ) : (
    //         <div className={classes.wallet}>
    //           <Typography className={classes.account}>
    //             Wallet Account Number:
    //           </Typography>
    //           <Typography>{walletAccountNumber}</Typography>
    //           <Button
    //             className={classes.button}
    //             variant="contained"
    //             color="primary"
    //             onClick={handleEdit}
    //           >
    //             Edit
    //           </Button>
    //         </div>
    //       )}
    //       <Typography className={classes.balance}>Wallet Balance:</Typography>
    //       <Typography>{balance}</Typography>
    //     </CardContent>
    //   </Card>
    // </div>
    <div className="profile-main-container">
      <div className="profile_container">
        <Avatar className="profile_avatar" src={user.img} />
        <label htmlFor="username">Username</label>
        <div id="username" className="profile_brand">
          {user.name}
        </div>
        <label htmlFor="email">Email</label>
        <div id="email" className="profile_brand">
          {user.email}
        </div>
        <label htmlFor="admin">Admin</label>
        {user.isAdmin ? (
          <div id="admin" className="profil_admin_true"></div>
        ) : (
          <div id="admin" className="profil_admin_false"></div>
        )}
        <label htmlFor="account">Wallet Account Number:</label>
        <div id="account" className="profile_brand">
          {account}
        </div>
        <div className="profile_account_info">
          Balance: <span>{balance} ETH</span>
        </div>
      </div>
    </div>
  );
}
