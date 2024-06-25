// CommonButton.tsx
import React, { FC } from 'react';
import { Button, SxProps } from '@mui/material';
import { Theme } from '@mui/system';

interface CommonButtonProps {
  label: string;
  onClick: () => void;
  sx?: SxProps<Theme>; // sx プロパティは MUI のスタイルオブジェクト
}

const CommonButton: FC<CommonButtonProps> = ({ label, onClick, sx }) => {
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
            lg: '2.7em'
        },
        py: {
            lg: '0.5em'
        },
        width: 'full !important',
        ...sx
      }}
    >
      {label}
    </Button>
  );
};

export default CommonButton;
