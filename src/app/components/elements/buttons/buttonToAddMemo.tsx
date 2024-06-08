import {
    Button as MuiButton,
    ButtonProps as MuiButtonProps,
  } from "@mui/material";
  import { ButtonHTMLAttributes, FC, ReactNode } from "react";
   
  type Props = MuiButtonProps & {
    children: ReactNode;
  };
  
//   todo: 不要な場合は削除予定
  const ButtonToAddMemo = ({ children, ...props }: Props) => {
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
  
  export default ButtonToAddMemo;
  