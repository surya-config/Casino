import React from "react";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import Modal from "react-awesome-modal";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { auth, provider } from "../../firebase";
import "./Header.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  logout,
  selectBalance,
  selectGuestBalance,
  selectUser,
  setBalanceAmount,
  setGuestBalanceAmount,
} from "../../features/userSlice";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },

  columnDiv: {
    display: "flex",
    flexDirection: "column",
    marginRight: theme.spacing(3),
  },
  greet: {
    fontSize: 11,
    margin: 0,
    marginBottom: theme.spacing(0.5),
  },
  name: {
    fontSize: 18,
    margin: 0,
  },
  balance: {
    fontSize: 11,
    margin: 0,
    marginBottom: theme.spacing(0.5),
  },
  amount: {
    fontSize: 18,
    margin: 0,
  },
}));

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address format")
    .required("Email is required"),
  password: Yup.string()
    .min(3, "Password must be 3 characters at minimum")
    .required("Password is required"),
});

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address format")
    .required("Email is required"),
  password: Yup.string()
    .min(3, "Password must be 3 characters at minimum")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function MenuComp() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const user = useSelector(selectUser);
  const [visible, setVisible] = React.useState(false);
  const dispatch = useDispatch();
  const [loginScreen, setLoginScreen] = React.useState(true);
  const balance = useSelector(selectBalance);
  const guestBalance = useSelector(selectGuestBalance);

  React.useEffect(() => {
    if (localStorage.getItem("user")) {
      let userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        dispatch(login(userData));
      }
    }

    let amount = localStorage.getItem("balance");

    if (amount) {
      dispatch(setBalanceAmount(amount));
    }

    if (!user) {
      dispatch(setGuestBalanceAmount(999));
    }
  }, []);

  const loginUser = (values) => {
    console.log("Logging on ...", values.email, values.password);
    auth
      .signInWithEmailAndPassword(values.email, values.password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        dispatch(login(user));
        dispatch(setBalanceAmount(balance));
        setVisible(false);

        // ...
      })
      .catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage);
      });
  };

  const signupUser = (values) => {
    auth
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        dispatch(login(user));
        dispatch(setBalanceAmount(9.99));
        setVisible(false);
        // ...
      })
      .catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage);
        // ..
      });
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleAuthentication = () => {
    if (user) {
      dispatch(logout());
    } else {
      setVisible(true);
    }
    setOpen(false);
  };

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        dispatch(login(user));
        dispatch(setBalanceAmount(9.99));
        setVisible(false);
        // ...
      })
      .catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage);
        // ..
      });
  };

  return (
    <div>
      <div className={classes.root}>
        <div className={classes.columnDiv}>
          <h5 className={classes.greet}>Hello,</h5>
          <h1 className={classes.name}>
            {user
              ? user.displayName
                ? user.displayName
                : user.email
              : "Guest"}
          </h1>
        </div>
        <div className={classes.columnDiv}>
          <h5 className={classes.balance}>Your Balance</h5>
          <h3 className={classes.amount}>${user ? balance : guestBalance}</h3>
        </div>

        <Button
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <AccountCircleOutlinedIcon style={{ fill: "white", fontSize: 40 }} />
        </Button>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem> */}
                    <MenuItem onClick={handleAuthentication}>
                      {user ? "Logout" : "Login"}
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      <Modal
        visible={visible}
        width="80%"
        height="80%"
        effect="fadeInUp"
        onClickaway={() => setVisible(false)}
        style={{ backgroundColor: "#111" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "2%",
              marginBotom: "5%",
            }}
          >
            <img
              style={{
                width: "150px",
                height: "100px",
                borderRadius: "999px",
                objectFit: "cover",
                marginBottom: "15px",
              }}
              src="/images/logo.jpg"
              alt="CASINO"
            />

            <h4
              style={{
                color: "#111",
                margin: 0,
                fontWeight: "700",
                fontSize: "16px",
              }}
            >
              {loginScreen ? "LOGIN" : "SIGNUP"}
            </h4>

            {loginScreen ? (
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={LoginSchema}
                onSubmit={(values, { setSubmitting }) => {
                  // alert("Form is validated! Submitting the form...");
                  values.email = values.email.toLowerCase();
                  loginUser(values);
                  setSubmitting(false);
                }}
              >
                {({ touched, errors, isSubmitting }) => (
                  <Form className="form">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        className={`form-control input-field ${
                          touched.email && errors.email ? "is-invalid" : ""
                        }`}
                      />
                      <ErrorMessage
                        component="div"
                        name="email"
                        className="invalid-feedback"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        className={`form-control input-field ${
                          touched.password && errors.password
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        component="div"
                        name="password"
                        className="invalid-feedback"
                      />
                    </div>

                    <button
                      type="submit"
                      className="login__button"
                      disabled={isSubmitting}
                    >
                      Login
                    </button>
                    <Button className="signin__button" onClick={signIn}>
                      Sign In with Google
                    </Button>
                    <h6 className="login__heading">
                      New User?{" "}
                      <Link
                        className="signup-link"
                        onClick={() => setLoginScreen(false)}
                      >
                        Create Account
                      </Link>
                    </h6>
                  </Form>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={{ email: "", password: "", confirmPassword: "" }}
                validationSchema={SignupSchema}
                onSubmit={(values, { setSubmitting }) => {
                  // alert("Form is validated! Submitting the form...");
                  values.email = values.email.toLowerCase();
                  signupUser(values);
                  setSubmitting(false);
                }}
              >
                {({ touched, errors, isSubmitting }) => (
                  <Form className="form">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        className={`form-control input-field ${
                          touched.email && errors.email ? "is-invalid" : ""
                        }`}
                      />
                      <ErrorMessage
                        component="div"
                        name="email"
                        className="invalid-feedback"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        className={`form-control input-field ${
                          touched.password && errors.password
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        component="div"
                        name="password"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <Field
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        className={`form-control input-field ${
                          touched.confirmPassword && errors.confirmPassword
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      <ErrorMessage
                        component="div"
                        name="confirmPassword"
                        className="invalid-feedback"
                      />
                    </div>

                    <button
                      type="submit"
                      className="login__button"
                      disabled={isSubmitting}
                    >
                      Sign up
                    </button>
                    <Button className="signin__button" onClick={signIn}>
                      Sign In with Google
                    </Button>
                    <h6 className="login__heading">
                      Already an User?{" "}
                      <Link
                        className="signup-link"
                        onClick={() => setLoginScreen(true)}
                      >
                        Sign In
                      </Link>
                    </h6>
                  </Form>
                )}
              </Formik>
            )}
            <IconButton
              style={{ position: "absolute", top: "20px", right: "20px" }}
              onClick={() => setVisible(false)}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
