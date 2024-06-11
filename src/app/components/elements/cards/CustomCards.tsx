import React, { ReactNode }  from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

type CustomCardProps = {
    href: string; // href は string 型
    icon: ReactNode; // icon は ReactNode 型
    label: string; // label は string 型
  };

const CustomCard: React.FC<CustomCardProps> = ({ href, icon, label }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '50%',
        width: {
          xs: '100%', // モバイル (0px 以上): 幅100%
          md: '45%', // 中程度の画面 (900px 以上): 幅30%
        },
        mb: 2,
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Link
          href={href}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              height: '8em',
              mr: 2,
              padding: '20px',
              '&:hover': {
                backgroundColor: 'transparent',
                boxShadow: 'none',
              },
              '& svg': {
                fontSize: '100px',
              },
            }}
          >
            {icon}
          </IconButton>
          <Box />
          <Box
            sx={{
              width: '100%',
              height: '4em',
              backgroundColor: 'lightBlue',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                width: '100%',
                textAlign: 'center',
                color: 'black',
                fontWeight: '550',
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
