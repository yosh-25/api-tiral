import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  return (
    <>
      <TextField
        type="text"
        variant="outlined"
        // todo: propsで渡す予定
        value={value}
        // todo: 関数名名前変更
        onChange={onChange}
        placeholder="検索ワードを入力"
        InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={onSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ m: 1, width: '100%' }}
      />
   
    </>
  );
};

export default SearchBar;
