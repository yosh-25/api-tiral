import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const isSearchPage = pathname === '/search';

  return (
    <Box
      component="footer"
      sx={{
        position: isSearchPage? 'fixed': null,
        bottom: isSearchPage? '0' : null,
        height: isSearchPage? '10vh': null,
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
          md: '1.2em',
        },
        mb: 0.5 }}>
        Memotube
      </Typography>
      
      <Typography variant="body2" 
      sx={{ 
        fontSize: {
          xs: '0.8em',
          md: '1.2em',
        },
        mt: 1 }}>
        © 2024 Memotube. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;