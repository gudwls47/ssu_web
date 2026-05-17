/**
 * 이미지 파일을 Canvas로 리사이즈 & 압축해 base64 Data URL로 변환합니다.
 * Firestore 저장 기준으로 최대 800px, JPEG 75%로 압축합니다.
 */
export function imageToDataUrl(
  file: File,
  maxWidth = 800,
  quality = 0.75,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas 사용 불가"));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.onerror = () => reject(new Error("이미지를 읽을 수 없습니다"));
      img.src = e.target!.result as string;
    };

    reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다"));
    reader.readAsDataURL(file);
  });
}
