"use client";
import React from 'react'
import { useRouter } from "next/navigation";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";


const SearchResults = () => {
  return (
    <Stack gap="3rem">
      <Box>
        {/* TODO; テキスト入力後、候補がでてきて選べる仕様にしたい */}
        <TextField
          placeholder="検索ワードを入力"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ m: 1 }}
        />
      </Box>
      <Box>
        <Typography>最近見た動画</Typography>
        <Box
          height="15rem"
          sx={{
            width: "100%",
            border: 1,
          }}
        >
          <Typography>ここに直近数回で見た動画を表示</Typography>
        </Box>
      </Box>
    </Stack>
  )
}

export default SearchResults
