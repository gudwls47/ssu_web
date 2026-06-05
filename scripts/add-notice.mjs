// 숭실대 축제에 공지 등록 스크립트
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYt_npasVeogxz7iOHilSR7MOHDyynWik",
  authDomain: "ssuweb-800e8.firebaseapp.com",
  projectId: "ssuweb-800e8",
  storageBucket: "ssuweb-800e8.firebasestorage.app",
  messagingSenderId: "234446546342",
  appId: "1:234446546342:web:a99b6ca2ded16bfa635b67",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  // 1. 숭실대 축제 찾기
  console.log("🔍 숭실대 축제 검색 중...");
  const festSnap = await getDocs(collection(db, "festivals"));

  const ssuFestivals = festSnap.docs.filter((d) => {
    const data = d.data();
    return (
      (data.school ?? "").includes("숭실") ||
      (data.name ?? "").includes("숭실") ||
      (data.nameEn ?? "").toLowerCase().includes("ssu")
    );
  });

  if (ssuFestivals.length === 0) {
    console.log("❌ 숭실대 축제를 찾지 못했습니다.");
    console.log(
      "전체 축제 목록:",
      festSnap.docs.map((d) => `${d.id}: ${d.data().name} (${d.data().school})`),
    );
    process.exit(1);
  }

  console.log(`✅ 숭실대 축제 ${ssuFestivals.length}개 발견:`);
  ssuFestivals.forEach((f) =>
    console.log(`  - ${f.data().name} (${f.data().school}) [id: ${f.id}]`),
  );

  // 첫 번째 숭실대 축제에 공지 등록
  const fest = ssuFestivals[0];
  const festivalId = fest.id;
  const festivalName = fest.data().name;

  console.log(`\n📢 "${festivalName}"에 공지 등록 중...`);

  const noticeRef = await addDoc(
    collection(db, "festivals", festivalId, "notices"),
    {
      title: "🎉 숭실대학교 축제 안내",
      content:
        "안녕하세요! 숭실대학교 축제에 오신 것을 환영합니다.\n\n행사 기간 동안 다양한 공연과 부스를 즐겨주세요.\n문의사항은 학생처로 연락 부탁드립니다.",
      category: "안내",
      pinned: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  console.log(`✅ 공지 등록 완료! (notice id: ${noticeRef.id})`);
  console.log(`   축제: ${festivalName}`);
  console.log(`   제목: 🎉 숭실대학교 축제 안내`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ 오류:", err);
  process.exit(1);
});
