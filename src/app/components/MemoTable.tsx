// import React from "react";
// import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Typography } from "@mui/material";
// import { MemoList } from "@/types";

// interface MemoTableProps {
//     videoData: any;
//     memoList: MemoList | undefined;
//     editMemo: (id: string, newContent: string) => void;
//     deleteMemo: (id: string) => void;
// }

// const MemoTable: React.FC<MemoTableProps> = ({ videoData, memoList, editMemo, deleteMemo }) => {
//     return (
//         <TableContainer sx={{ marginBottom: "50px" }}>
//             <Typography variant="h3" fontWeight="650" sx={{ fontSize: "1rem" }}>
//                 {videoData ? videoData.videoTitle : "Loading..."}
//             </Typography>
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell width="20%">再生位置</TableCell>
//                         <TableCell align="left">メモ</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {memoList
//                         ?.filter((memo) => memo.videoId === videoData?.videoId)
//                         .sort((a, b) => {
//                             const convertToSeconds = (createdAt: string) => {
//                                 const Numbers = createdAt.split(":").map(Number);
//                                 if (Numbers.length === 3) {
//                                     const [hours, minutes, seconds] = Numbers;
//                                     return hours * 3600 + minutes * 60 + seconds;
//                                 } else {
//                                     const [minutes, seconds] = Numbers;
//                                     return minutes * 60 + seconds;
//                                 }
//                             };
//                             const timeA = convertToSeconds(a.createdAt);
//                             const timeB = convertToSeconds(b.createdAt);
//                             return timeA - timeB;
//                         })
//                         .map((memo) => (
//                             <TableRow key={memo.id}>
//                                 <TableCell>{memo.createdAt}</TableCell>
//                                 <TableCell>
//                                     {!memo.isEditing ? (
//                                         <>
//                                             <TableCell>{memo.content}</TableCell>
//                                             <TableCell>
//                                                 <Button variant="outlined" onClick={() => editMemo(memo.id, memo.content)}>編集</Button>
//                                             </TableCell>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <TextField
//                                                 value={memo.content}
//                                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => editMemo(memo.id, e.target.value)}
//                                                 size="small"
//                                             />
//                                             <Button variant="contained" sx={{ ml: 1 }} onClick={() => editMemo(memo.id, memo.content)}>保存</Button>
//                                             <Button sx={{ ml: 1 }} onClick={() => editMemo(memo.id, memo.content)}>キャンセル</Button>
//                                         </>
//                                     )}
//                                 </TableCell>
//                                 <TableCell>
//                                     <Button onClick={() => deleteMemo(memo.id)}>削除</Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );
// };

// export default MemoTable;
