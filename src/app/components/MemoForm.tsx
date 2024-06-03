// import React from "react";
// import { Box, Button, TextField, Typography } from "@mui/material";
// import { Memo } from "@/types";

// interface MemoFormProps {
//     timeToShow: string;
//     newMemo: Memo;
//     setNewMemo: React.Dispatch<React.SetStateAction<Memo>>;
//     saveMemo: () => void;
//     setMemoMode: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const MemoForm: React.FC<MemoFormProps> = ({
//     timeToShow,
//     newMemo,
//     setNewMemo,
//     saveMemo,
//     setMemoMode,
// }) => {
//     const handleMemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setNewMemo({ ...newMemo, content: e.target.value });
//     };

//     return (
//         <Box sx={{ width: "70%" }}>
//             <Box display="flex" alignItems="center" padding="0.5rem" margin="0.5rem 0" sx={{ border: 1 }}>
//                 <Typography sx={{ padding: "0.3rem 1rem", marginLeft: "1rem", fontWeight: "bold", fontSize: "1rem", whiteSpace: "nowrap" }}>
//                     {timeToShow}
//                 </Typography>
//                 <TextField
//                     variant="standard"
//                     placeholder="ここにメモを記入"
//                     value={newMemo.content}
//                     onChange={handleMemoChange}
//                     InputProps={{ disableUnderline: true }}
//                     sx={{ width: "100%" }}
//                 />
//             </Box>
//             <Box display="flex" justifyContent="flex-end">
//                 <Box marginRight="1rem">
//                     <Button sx={{ border: 1, width: "100%" }} onClick={() => setMemoMode(false)}>キャンセル</Button>
//                 </Box>
//                 <Box>
//                     <Button sx={{ border: 1, width: "100%" }} onClick={() => { setMemoMode(false); saveMemo(); }}>保存する</Button>
//                 </Box>
//             </Box>
//         </Box>
//     );
// };

// export default MemoForm;
