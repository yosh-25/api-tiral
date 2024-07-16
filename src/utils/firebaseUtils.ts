import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { Memo } from "@/types/index";

export const fetchMemoList = async (uid: string): Promise<Memo[]> => {
  const q = query(collection(db, "memoList"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      videoId: data.videoId,
      videoTitle: data.videoTitle,
      videoThumbnail: data.videoThumbnail,
      createdTime: data.createdTime,
      createdAt: data.createdAt,
      content: data.content,
      uid: data.uid,
    };
  });
};

export const fetchVideoInfo = async (videoId: string) => {
  const q = query(
    collection(db, "memoList"),
    where("videoId", "==", videoId),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return doc.data();
  }
  return null;
};

export const saveMemoToFirebase = async (
  newMemo: Memo,
  currentUser: User | null,
  timeToShow: string
) => {
  await addDoc(collection(db, "memoList"), {
    ...newMemo,
    createdTime: serverTimestamp(),
    createdAt: timeToShow,
    uid: currentUser?.uid,
  });
};

export const updateMemoContent = async (id: string, newContent: string) => {
  const docRef = doc(db, "memoList", id);
  await updateDoc(docRef, { content: newContent });
};

export const deleteMemo = async (id: string) => {
  await deleteDoc(doc(db, "memoList", id));
};
