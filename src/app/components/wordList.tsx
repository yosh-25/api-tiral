import Link from "next/link";
import { Word } from "../../types";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

type WordProps = {
  word: Word;
};

const WordList: React.FC<WordProps> = ({ word }) => {
  const dateString = word.registeredDate.toString();

  return (
    <>
      <TableRow key={word.id}>
        <TableCell>{word.spelling}</TableCell>
        <TableCell>{word.meaning}</TableCell>
        <TableCell>{word.translation}</TableCell>
        <TableCell>{dateString}</TableCell>
        <TableCell>{word.status ? "〇" : "×"}</TableCell>
        <TableCell>
          <Button>編集</Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default WordList;
