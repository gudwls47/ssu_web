# 🎉 FESTA — 캠퍼스 축제 정보 통합 플랫폼

대학 축제 정보를 한곳에서 확인하고 실시간으로 소통할 수 있는 웹 플랫폼입니다.

---

## 주요 기능

### 🏠 메인 페이지

- 네이버 지도 기반 축제 위치 마커 (LIVE·예정 구분)
- 진행 중 / 예정 / 종료 축제 카드 목록 (상태 뱃지 + 참여자 수)
- 로그인 + 참여 등록 축제가 있으면 지도 대신 **내 축제 슬라이드 위젯** 표시
  - 표지 → 소개 → 부스 → 공지 → 톡 탭 클릭 전환
  - 여러 축제 참여 시 상단 탭으로 축제 선택
  - 삭제된 축제의 참여 기록 자동 정리

### 🎪 축제 상세 페이지

- **히어로 섹션**: 썸네일, 이름, 날짜, 장소, 참여자 수, 참여 등록/취소 버튼, 공유 링크
- **라인업 탭**: 날짜별 아티스트 타임테이블 (시간·분류·스테이지)
- **지도 탭**: 핀 기반 행사장 지도 (부스·무대·화장실·흡연구역·안내소), DAY 필터, 핀 호버 툴팁, 범례 사이드바
- **부스 탭**: 분류·구역별 필터, 아코디언 상세(줄바꿈 반영), 좋아요/싫어요 반응, 정렬 (좋아요·싫어요 많은·적은 순)
- **공지 탭**: 카테고리(긴급·안내·교통·굿즈)별 공지, 클릭 시 상세 모달 (줄바꿈 반영)
- **커뮤니티(톡) 탭**: 실시간 자유 게시판
  - 라인업·지도·부스·공지 태그 선택 후 글 작성
  - 태그별 필터, 로그인 시 닉네임 표시 (익명 토글), 내가 쓴 글 삭제

### 👤 회원 기능

- 이메일/비밀번호 회원가입 · 로그인
- Google 소셜 로그인 · 회원가입
- 일반 사용자 / 축제 주최자 역할 구분
- **마이페이지** (일반 사용자): 회원 정보, 내가 참여한 축제 목록, 내가 남긴 톡, 회원탈퇴
- **로그아웃** / **회원탈퇴** (이메일 재인증 or Google 재인증)

### 🛠 관리자 기능

#### 축제 관리
- 축제 등록 (이름·날짜·장소·좌표 검색·썸네일·색상·태그라인·소개)
- 축제 수정·삭제 (삭제 확인 모달)

#### 부스 관리
- 부스 추가·수정·삭제 (이름·학과·위치·구역·일정·분류·소개·운영 날짜)
- DAY별 필터, 운영 날짜 토글

#### 지도 관리
- SVG 템플릿 선택 또는 외부 이미지 URL 업로드
- 지도 클릭으로 핀 배치 (무대·부스·화장실·흡연구역·안내소)
- 핀에 부스 연결, 운영 날짜 설정
- DAY별 미리보기 (비활성 핀 반투명 표시)
- 어드민 핀 좌표와 공개 지도 위치 정확히 일치 (`aspect-ratio: 320/420`)

#### 라인업 관리
- DAY별 공연 추가·수정·삭제 (시간·아티스트·분류·스테이지)

#### 공지 관리
- 공지 작성·삭제 (카테고리 선택, 긴급 고정)

#### 계정 관리
- 전체 회원 목록 조회 (이름·이메일·소속·가입일·역할)
- 역할 변경 (일반 ↔ 관리자)
- 본인 계정 회원탈퇴

#### 통계
- 축제별 참여자 수, 진행 중·예정 축제 현황

---

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| 프레임워크 | Next.js 15 (App Router, Turbopack) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS + 커스텀 CSS 변수 (다크모드·팔레트 지원) |
| 상태 관리 | TanStack Query (react-query) |
| 인증 | Firebase Authentication (이메일·Google) |
| 데이터베이스 | Firebase Firestore |
| 스토리지 | Firebase Storage |
| 지도 | 네이버 지도 API |
| 토스트 | Sonner |

---

## 시작하기

### 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력합니다.

```env
NEXT_PUBLIC_FB_API_KEY=...
NEXT_PUBLIC_FB_AUTH_DOMAIN=...
NEXT_PUBLIC_FB_PROJECT_ID=...
NEXT_PUBLIC_FB_STORAGE_BUCKET=...
NEXT_PUBLIC_FB_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FB_APP_ID=...
NEXT_PUBLIC_FB_MEASUREMENT_ID=...
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=...
NEXT_PUBLIC_FB_DATABASE_URL=...
NAVER_MAP_CLIENT_SECRET=...
```

### 개발 서버 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

---

## 프로젝트 구조

```
src/app/
├── api/              # Firebase 연동 훅 (festivals, booths, notices, auth, userFestivals 등)
├── components/       # 공통 컴포넌트 (Header, FestivalCard, MyFestivalWidget, MapTemplates 등)
├── festival/[id]/    # 축제 상세 페이지 및 탭 컴포넌트 (Lineup·Map·Booth·Notice·Community)
├── admin/            # 관리자 콘솔 (festivals·booth·map·lineup·notice·accounts·stats)
├── mypage/           # 일반 사용자 마이페이지
├── login/            # 로그인
├── signup/           # 회원가입 (일반·주최자)
├── styles/           # 글로벌 스타일 (festa.css, global.css, reset.css)
└── utils/            # Firebase 초기화 등 유틸리티
```
