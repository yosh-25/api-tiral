import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  label: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClick,
  label,
}) => {
  return (
    <TextField
      type="text"
      variant="outlined"
      value={value}
      onChange={onChange}
      placeholder={label}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton 
            onClick={onClick}
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ m: 1, width: "100%" }}
    />
  );
};

export default SearchBar;
