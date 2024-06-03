// import { useState, useEffect } from "react";
// import { db } from "../../../lib/firebase";
// import { collection, addDoc, getDocs, serverTimestamp, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
// import { Memo, MemoList } from "@/types";

// const useMemoOperations = (currentUser: any) => {
//     const [memoList, setMemoList] = useState<MemoList>([]);
//     const [newMemo, setNewMemo] = useState<Memo>({
//         id: "",
//         videoId: "",
//         videoTitle: "",
//         videoThumbnail: "",
//         createdTime: "",
//         createdAt: "",
//         content: "",
//         isEditing: false,
//         uid: "",
//     });

//     const fetchMemoList = async () => {
//         if (!currentUser) return;
//         const q = query(collection(db, "memoList"), where("uid", "==", currentUser.uid));
//         const querySnapshot = await getDocs(q);
//         const memoList: MemoList = querySnapshot.docs.map((doc) => {
//             const { videoId, videoTitle, videoThumbnail, createdTime, createdAt, content, uid } = doc.data();
//             return { id: doc.id, videoId, videoTitle, videoThumbnail, createdTime, createdAt, content, uid };
//         });
//         setMemoList(memoList);
//     };

//     useEffect(() => {
//         fetchMemoList();
//     }, [currentUser]);

//     const saveMemo = async () => {
//         const CurrentDate = () => {
//             const today = new Date();
//             const year = today.getFullYear();
//             const month = ("0" + (today.getMonth() + 1)).slice(-2);
//             const day = ("0" + today.getDate()).slice(-2);
//             setNewMemo((state) => ({
//                 ...state,
//                 createdTime: year + "-" + month + "-" + day + " ",
//             }));
//         };
//         CurrentDate();
//         await addDoc(collection(db, "memoList"), {
//             ...newMemo,
//             createdTime: serverTimestamp(),
//             uid: currentUser.uid,
//         });
//         fetchMemoList();
//     };

//     const editMemo = async (id: string, newContent: string) => {
//         const docRef = doc(db, "memoList", id);
//         await updateDoc(docRef, { content: newContent });
//         fetchMemoList();
//     };

//     const deleteMemo = async (id: string) => {
//         await deleteDoc(doc(db, "memoList", id));
//         fetchMemoList();
//     };

//     return { memoList, newMemo, setNewMemo, saveMemo, editMemo, deleteMemo, fetchMemoList };
// };

// export default useMemoOperations;
