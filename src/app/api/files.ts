import { useQuery } from "@tanstack/react-query";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage, db } from "../utils/firebase/db";

export const uploadFileAndGetId = async (file: File) => {
  const fileRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);

  const docRef = await addDoc(collection(db, "files"), {
    fileName: file.name,
    filePath: fileRef.fullPath,
    contentType: file.type,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export const useFileById = (fileId: string) => {
  return useQuery({
    queryKey: ["files", fileId],
    queryFn: async () => {
      const docRef = doc(db, "files", fileId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("File not found");
      }

      const { filePath } = docSnap.data();

      const fileRef = ref(storage, filePath);
      const url = await getDownloadURL(fileRef);

      return url;
    },
    enabled: !!fileId,
  });
};
