import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchIconAndFunction = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {
    // 検索ワードをクエリパラメータに追加して次のページへ遷移
    if (searchTerm.trim()) {
      router.push(`/search/results/${searchTerm}`);
    }
  };

  return (
    <TextField
      type="text"
      variant="outlined"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="動画を検索"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ m: 1, width: "100%" }}
    />
  );
};

export default SearchIconAndFunction;
