import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#001f3f',
        color: 'white',
        mt: 4,
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Memotube
      </Typography>
      {/* <Box sx={{ display: 'flex', gap: 2 }}>
        <Link href="/about" color="inherit">
          About Us
        </Link>
        <Link href="/contact" color="inherit">
          Contact
        </Link>
        <Link href="/privacy" color="inherit">
          Privacy Policy
        </Link>
        <Link href="/terms" color="inherit">
          Terms of Service
        </Link>
      </Box> */}
      <Typography variant="body2" sx={{ mt: 2 }}>
        © 2024 Memotube. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
