import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import { Button, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import { withFirebase } from "./Firebase";
import { withRouter } from "react-router-dom";
import Link from "react-router-dom/Link";
import Divider from "@material-ui/core/Divider";

import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import CandidateProfile from "./CandidateProfile";

const INITIAL_STATE = {
  email: "",
  error: null,
  candidates: [],
  candidatesDetails: [],
};

const useStyles = {
  box: {
    "font-size": "20px",
    padding: "10px",
    fontFamily: "Comic Sans",
  },
  paper: {
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  name: {
    marginTop: "100px",
  },
  gg: {
    "font-size": "30px",
    padding: "10px",
    fontFamily: "Comic Sans",
  },
  avatar: {
    margin: "4px",
    backgroundColor: "#009688",
  },
  image: {
    marginTop: "30px",
    width: "200px",
    height: "auto",
    "object-fit": "cover",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: "16px",
  },
  submit: {
    margin: "16px 2px 8px",
  },
  search: {
    position: "relative",
    backgroundColor: "#b4ffff",
    marginBottom: "30px",
    marginLeft: "33%",
    width: "35%",
  },
  searchIcon: {
    padding: "0px 2px",
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: "1px 1px 1px 0px",
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + 4px)`,
    width: "100%",
  },
};

class Adminbase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.arr = [];
  }

  componentDidMount() {
    const userId = this.props.firebase.auth.currentUser.uid;
    this.props.firebase.db
      .doc(`/recruiters/${userId}`)
      .get()
      .then((snapshot) => {
        const curUser = snapshot.data();
        this.setState(curUser);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = async (event) => {
    //loop here to change the array of candidates
    let i = 0;
    let fordel = [];
    for (i = 0; i < this.state.candidates.length; i++) {
      const element = this.state.candidates[i];
      var found = 0;
      this.props.firebase.db
        .doc(`/users/${element}`)
        .get()
        .then((snapshot) => {
          const curUser = snapshot.data().skills;
          curUser.forEach((ele) => {
            // console.log(ele);
            if (ele === this.state.skill) {
              found = 1;
              this.arr.push(element);
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    setTimeout(() => {
      // if (newState == -1) {
      console.log(this.arr);
      this.setState({ candidates: [] });
      this.setState({ candidates: this.arr });
      this.arr = [];
      this.setState({ skill: "" });
      // }
    }, 1000);
    // await
  };

  onClear = (event) => {
    const userId = this.props.firebase.auth.currentUser.uid;
    console.log(this.props.firebase.auth.currentUser.uid);
    this.props.firebase.db
      .doc(`/recruiters/${userId}`)
      .get()
      .then((snapshot) => {
        const curUser = snapshot.data();
        this.setState(curUser);
        console.log(this.state.candidates);
        this.arr=[];
      })
      .catch((error) => {
        console.log(error);
      });
      event.preventDefault();
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="homecontainer">
        <Typography
          variant="h2"
          color="primary"
          gutterBottom
          className={classes.name}
        >
          {this.state.companyName}
        </Typography>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Skills..."
            name="skill"
            value={this.state.skill}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            onChange={this.onChange}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={this.onSubmit}
          >
            add
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={this.onClear}
          >
            clear
          </Button>
        </div>

        <Grid container justify="center">
          {this.state.candidates.map((val, ind, ar) => {
            return <CandidateProfile id={ind} uid={val} />;
          })}
        </Grid>
      </div>
    );
  }
}

const Admin = withRouter(withFirebase(withStyles(useStyles)(Adminbase)));
export default Admin;
