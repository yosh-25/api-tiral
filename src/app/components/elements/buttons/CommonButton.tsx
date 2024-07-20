// CommonButton.tsx
import React, { FC } from 'react';
import { Button, SxProps } from '@mui/material';
import { Theme } from '@mui/system';

interface ButtonForMemoEditingProps {
  label: string;
  onClick: () => void;
}

const ButtonForMemoEditing: FC<ButtonForMemoEditingProps> = ({ label, onClick }) => {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      sx={{
        fontSize: {
          xs: "0.7em",
          md: "0.875em",
        },
        px: {
            sm: "20px",
            lg: '20px'
        },
        py: {
            lg: '8px'
        },
        width: {
          xs: "auto",
          sm: "100px", 
          md: "80px",
        },
      }}
    >
      {label}
    </Button>
  );
};

export default ButtonForMemoEditing;