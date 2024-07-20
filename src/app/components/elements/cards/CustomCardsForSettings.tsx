import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

type CustomCardProps = {
  href: string;
  icon: ReactNode;
  label: string;
};

const CustomCard: React.FC<CustomCardProps> = ({ href, icon, label }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "50%",
        width: {
          xs: "100%",
          md: "48%",
        },
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link
          href={href}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              height: "8em",
              mx: "auto",
              padding: "20px",
              "&:hover": {
                backgroundColor: "transparent",
                boxShadow: "none",
              },
              "& svg": {
                fontSize: "100px",
              },
            }}
          >
            {icon}
          </IconButton>
          <Box />
          <Box
            sx={{
              width: "100%",
              height: "4em",
              backgroundColor: "#81d4fa",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                width: "100%",
                textAlign: "center",
                color: "black",
                fontWeight: "550",
              }}
            >
              {label}
            </Typography>
          </Box>
        </Link>
      </Box>
    </Box>
  );
};

export default CustomCard;
