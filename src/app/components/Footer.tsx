import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: "0",
        height: { xs: "85px", md: "100px" },
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#001f3f",
        color: "white",
        p: "16px",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: {
            xs: "0.9rem",
            md: "1.2rem",
          },
          mb: "4px",
        }}
      >
        Memotube
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontSize: {
            xs: "0.8rem",
            md: "1.2rem",
          },
          mt: "8px",
        }}
      >
        © 2024 Memotube. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
