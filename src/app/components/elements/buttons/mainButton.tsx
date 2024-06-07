import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { ButtonHTMLAttributes, FC, ReactNode } from "react";

// 参考　https://zenn.dev/nino_cast/books/43c539eb47caab/viewer/d432a6

type Props = MuiButtonProps & {
  children: ReactNode;
};

const MainButton = ({ children, ...props }: Props) => {
  return (
    <MuiButton
      variant="contained"
      sx={{
        // width:'10rem',
        p:'0.6rem'

      }}   
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default MainButton;
