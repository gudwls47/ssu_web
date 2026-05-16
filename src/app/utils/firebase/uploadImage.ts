import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./db";

/**
 * 이미지를 Firebase Storage에 업로드하고 다운로드 URL을 반환합니다.
 * @param file  업로드할 File 객체
 * @param path  저장 경로 prefix (기본값: "thumbnails")
 */
export async function uploadImage(
  file: File,
  path = "thumbnails",
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileRef = ref(storage, `${path}/${Date.now()}.${ext}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}
