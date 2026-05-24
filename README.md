# 🎉 FESTA — 숭실대학교 축제 플랫폼

대학 축제 정보를 한곳에서 확인하고 실시간으로 소통할 수 있는 웹 플랫폼입니다.

---

## 주요 기능

### 🏠 메인 페이지
- 진행 중 / 예정 / 종료 축제 목록 (참여자 수 포함)
- 로그인 + 참여 등록한 축제가 있으면 지도 대신 **내 축제 슬라이드 위젯** 표시
  - 표지 → 소개 → 부스 → 공지 → 톡 순으로 5초마다 자동 전환
  - 여러 축제 참여 시 상단 탭으로 축제 선택

### 🎪 축제 상세 페이지
- **히어로 섹션**: 썸네일, 이름, 날짜, 참여자 수, 참여 등록 버튼
- **라인업 탭**: 날짜별 아티스트 타임테이블
- **지도 탭**: 핀 기반 행사장 지도 (부스·무대·편의시설 등)
- **부스 탭**: 아코디언 상세 보기, 좋아요/싫어요 반응, 정렬 필터 (좋아요/싫어요 많은·적은 순)
- **공지 탭**: 카테고리(긴급·안내·교통·굿즈)별 공지
- **커뮤니티(톡) 탭**: 실시간 자유 게시판
  - 라인업·지도·부스·공지 태그 선택 후 글 작성
  - 태그별 필터
  - 로그인 시 닉네임 표시 (익명 토글 가능)
  - 내가 쓴 글 삭제

### 👤 회원 기능
- 이메일/비밀번호 회원가입 · 로그인
- Google 소셜 로그인
- 일반 회원 / 관리자 역할 구분
- **마이페이지**: 회원 정보, 내가 참여한 축제, 내가 남긴 톡

### 🛠 관리자 기능
- 축제 등록·수정·삭제
- 라인업·부스·지도 핀·공지 관리

---

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS + 커스텀 CSS 변수 |
| 상태 관리 | TanStack Query (react-query) |
| 인증 | Firebase Authentication |
| 데이터베이스 | Firebase Firestore |
| 스토리지 | Firebase Storage |
| 지도 | 네이버 지도 API |

---

## 시작하기

### 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력합니다.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=...
```

### 개발 서버 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

---

## 브랜치 전략

| 브랜치 | 용도 |
|--------|------|
| `main` | 기준 브랜치 |
| `hyungjin` | 개발 작업 브랜치 |

> **주의:** 배포 전 `hyungjin` → `main` PR을 통해 병합합니다.

---

## 프로젝트 구조

```
src/app/
├── api/              # Firebase 연동 훅 (festivals, booths, notices, auth 등)
├── components/       # 공통 컴포넌트 (Header, FestivalCard, MyFestivalWidget 등)
├── festival/[id]/    # 축제 상세 페이지 및 탭 컴포넌트
├── admin/            # 관리자 페이지
├── mypage/           # 마이페이지
├── login/            # 로그인
├── signup/           # 회원가입
└── styles/           # 글로벌 스타일
```
