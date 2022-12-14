import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import url from "../constants/global.jsx";
import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useLocation } from "react-router-dom";

//create theme
const theme = createTheme();

//styling for the confirmation pop-up
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid lightgreen",
  boxShadow: 10,
  pt: 2,
  px: 4,
  pb: 3,
};

//exporting the actual app!
export default function ViewApplicants() {
  //get the listing id
  const locationCall = useLocation();
  const listingId = locationCall.state.listingId;

  //code to handle opening and closing of the confirmation pop-up
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //function that fires when the user confirms that they want to delete the listing
  const navigate = useNavigate();
  const handleDelete = () => {
    axios
      .delete(
        `${url}/listingpage/removal/${listingId}`, //add the appropriate listingid
        {
          auth: {
            username: "admin@lendahand.com",
            password: "password",
          },
        }
      )
      .then(
        (res) => {
          console.log("successful deletion!");
          console.log(res);
          handleClose();
          navigate("/listingpage/mylistings");
        },
        (error) => {
          console.log("unsuccessful deletion");
          console.log(error);
        }
      );
  };

  //variable to set the imageurl for the picture
  const [imageurl, setImageurl] = useState(`url("https://www.kindpng.com/picc/m/55-553143_transparent-plant-cartoon-png-transparent-cartoon-plant-png.png")`);

  //variables to set the project title, description, location, tag, commitment displayed
  const [title, setTitle] = useState("Project title");
  const [description, setDescription] = useState("Project description");
  const [location, setLocation] = useState("Location");
  const [tag, setTag] = useState("Tag");
  const [commitment, setCommitment] = useState("Commitment");

  //variable to hold the array of applicants
  const [applicants, setApplicants] = useState([]);

  //useEffect for the api calls
  React.useEffect(() => {
    //api call to get the image
    axios
      .get(`${url}/listingpage/${listingId}/image`, {
        responseType: "arraybuffer",
      })
      .then(
        (res) => {
          console.log("successfully got the image");
          console.log(res);

          const imagedata = res.data;
          const contenttype = res.headers.get("content-type");
          var blob = new Blob([imagedata], { type: contenttype });
          var url = (URL || webkitURL).createObjectURL(blob);
          setImageurl(url);
        },
        (error) => {
          console.log("image get failed");
          console.log(error);
        }
      );

    //api call to get the applicants, listing details
    axios
      .get(
        `${url}/listingpage/${listingId}`, //need to pass in the relevant listingid in this url
        {
          auth: {
            username: "admin@lendahand.com",
            password: "password",
          },
        }
      )
      .then(
        (response) => {
          // console.log("successfully got the listing data");
          // console.log(response);

          //set listing details
          setTitle(response.data.name);
          setDescription(response.data.des);
          setLocation(response.data.location);
          setTag(response.data.tag.value);
          setCommitment(response.data.commitment);

          //set the array of applicants
          console.log("applications", response.data.applications);
          var applications = response.data.applications;
          var people = [];
          applications.map((data, index) => {
            people[index] = data.applicant;
          });

          setApplicants(people);
          console.log("people", people);
        },
        (error) => {
          console.log("unsuccessful get of listing data");
          console.log(error);
        }
      );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh", width: "100vw" }}>
        <CssBaseline />

        {/* image component on the left */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url(${imageurl})`,
          }}
        ></Grid>

        {/* text component on the right */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            // backgroundColor="blue"
            sx={{
              my: 4,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* listing preview portion */}
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <VisibilityIcon />
            </Avatar>

            <Typography component="h1" variant="h4">
              Listing preview
            </Typography>

            <Box
              noValidate
              sx={{ mt: 2 }}
            >
              {/* Project title field */}
              <Typography
                sx={{ color: "#212121", ml: 0.5 }}
                align="left"
                variant="h6"
                component="div"
              >
                Project title:
              </Typography>
              <Box
                width="535px"
                sx={{
                  py: 1,
                  px: 1,
                  border: "1px solid grey",
                  borderRadius: 1.5,
                  overflow: "hidden",
                  overflowX: "scroll",
                }}
              >
                <Typography
                  sx={{ color: "#838383" }}
                  align="left"
                  variant="subtitle1"
                  component="div"
                >
                  {title}
                </Typography>
              </Box>

              {/* Project description field */}
              <Typography
                sx={{ color: "#212121", ml: 0.5, mt: 2 }}
                align="left"
                variant="h6"
                component="div"
              >
                Project Description:
              </Typography>
              <Box
                width="535px"
                height="120px"
                sx={{
                  py: 1,
                  px: 1,
                  border: "1px solid grey",
                  borderRadius: 1.5,
                  overflow: "hidden",
                  overflowX: "scroll",
                  overflowY: "scroll",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  sx={{ color: "#838383" }}
                  align="left"
                  variant="subtitle1"
                  component="div"
                >
                  {description}
                </Typography>
              </Box>

              {/* location, tags, committment */}

              <Box
                container
                justifyContent="center"
                spacing={3}
                sx={{ mb: 1, mt: 3 }}
              >
                <Grid
                  container
                  justifyContent="center"
                  spacing={3}
                  sx={{ mt: 0, mb: 1 }}
                >
                  {/* location */}
                  <Box item>
                    <Typography
                      sx={{ color: "#212121", fontSize: "17px" }}
                      variant="h6"
                    >
                      Location:
                    </Typography>
                    <Box
                      item
                      width="120px"
                      sx={{
                        py: 1,
                        px: 1,
                        mx: 3,
                        border: "1px solid grey",
                        borderRadius: 1.5,
                        overflow: "hidden",
                        overflowX: "scroll",
                      }}
                    >
                      <Typography
                        sx={{ color: "#838383" }}
                        align="center"
                        variant="subtitle1"
                        component="div"
                      >
                        {location}
                      </Typography>
                    </Box>
                  </Box>

                  {/* tag */}
                  <Box item>
                    <Typography
                      sx={{ color: "#212121", fontSize: "17px" }}
                      variant="h6"
                    >
                      Tag:
                    </Typography>
                    <Box
                      item
                      width="120px"
                      sx={{
                        py: 1,
                        px: 1,
                        mx: 2,
                        border: "1px solid grey",
                        borderRadius: 1.5,
                        overflow: "hidden",
                        overflowX: "scroll",
                      }}
                    >
                      <Typography
                        sx={{ color: "#838383" }}
                        align="center"
                        variant="subtitle1"
                        component="div"
                      >
                        {tag}
                      </Typography>
                    </Box>
                  </Box>

                  {/* commitment */}
                  <Box item>
                    <Typography
                      sx={{ color: "#212121", fontSize: "17px" }}
                      variant="h6"
                    >
                      Commitment:
                    </Typography>
                    <Box
                      item
                      width="120px"
                      sx={{
                        py: 1,
                        px: 1,
                        mx: 3,
                        border: "1px solid grey",
                        borderRadius: 1.5,
                        overflow: "hidden",
                        overflowX: "scroll",
                      }}
                    >
                      <Typography
                        sx={{ color: "#838383" }}
                        align="center"
                        variant="subtitle1"
                        component="div"
                      >
                        {commitment}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Box>

              <Typography
                sx={{ color: "#212121", ml: 0.5, mt: 3 }}
                align="left"
                variant="h6"
                component="div"
              >
                Applicant details:
              </Typography>
              <Box
                container
                sx={{
                  border: "1px solid grey",
                  borderRadius: 1.5,
                  backgroundColor: "blue",
                }}
              >
                <List
                  item
                  sx={{
                    width: "100%",
                    maxWidth: 535,
                    bgcolor: "background.paper",
                    position: "relative",
                    overflow: "auto",
                    maxHeight: 200,
                    "& ul": { padding: 0 },
                  }}
                >
                  {applicants.map((value, index) => (
                    <ListItem key={index}>
                      {/* <Typography>
                        
                      </Typography> */}
                      <ListItemText
                        primary={`Name: ${value.firstname} ${value.lastname}`}
                        secondary={`ContactNo: ${value.contactNo}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
              {/* delete button */}
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleOpen}
              >
                Delete Listing
              </Button>

              {/* Delete confirmation pop up */}
              <Modal
                hideBackdrop
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
              >
                <Box
                  sx={{ ...modalStyle, border: "2px solid pink", width: 400 }}
                >
                  <h2 id="child-modal-title">
                    Are you sure you want to delete your listing?
                  </h2>
                  <Button onClick={handleClose}>No, oops</Button>
                  <Button onClick={handleDelete}>Yes</Button>
                </Box>
              </Modal>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}