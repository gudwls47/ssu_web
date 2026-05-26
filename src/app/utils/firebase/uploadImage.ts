import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./db";

const TIMEOUT_MS = 15_000; // 15초 초과 시 에러

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

  const uploadPromise = uploadBytes(fileRef, file).then(() =>
    getDownloadURL(fileRef),
  );

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(
      () =>
        reject(
          new Error(
            "업로드 시간 초과 — Firebase Storage 규칙을 확인해주세요.\n" +
              "콘솔 → Storage → Rules → allow read, write: if true",
          ),
        ),
      TIMEOUT_MS,
    );
  });

  return Promise.race([uploadPromise, timeoutPromise]);
}
