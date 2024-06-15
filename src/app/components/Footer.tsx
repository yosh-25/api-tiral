import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: '0',
        height: '13vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#001f3f',
        color: 'white',
        p: 2
        // mt: 4,
      }}
    >
      <Typography variant="h6" sx={{ 
        fontSize: {
          xs: '0.9em',
          md: '1.6em',
          lg: '1.25em'
        },
        mb: 0.5 }}>
        Memotube
      </Typography>
      
      <Typography variant="body2" 
      sx={{ 
        fontSize: {
          xs: '0.8em',
          md: '1.5em',
          lg: '1.25em'
        },
        mt: 1 }}>
        © 2024 Memotube. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;