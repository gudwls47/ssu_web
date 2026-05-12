"use client";

import { useState } from "react";

interface Post {
  id: string;
  author: string;
  time: string;
  body: string;
  likes: number;
  replies: number;
  tag: string;
  festName?: string;
}

const POSTS: Post[] = [
  {
    id: "c1",
    author: "익명의 숭실인",
    time: "방금",
    body: "경영대 떡볶이 줄 거의 없음 ㄱㄱ",
    likes: 12,
    replies: 3,
    tag: "정보",
    festName: "2026 숭실 대동제",
  },
  {
    id: "c2",
    author: "상도동냥이",
    time: "4분 전",
    body: "여자 화장실 D동 비교적 한산해요. A동은 줄 30명+",
    likes: 47,
    replies: 8,
    tag: "정보",
    festName: "2026 숭실 대동제",
  },
  {
    id: "c3",
    author: "숭실26",
    time: "11분 전",
    body: "PLAVE 무대 어디서 보기 좋을까요?",
    likes: 9,
    replies: 21,
    tag: "질문",
    festName: "2026 숭실 대동제",
  },
  {
    id: "c4",
    author: "IT대생",
    time: "32분 전",
    body: "IT대 IPA 품절 임박이래요",
    likes: 28,
    replies: 5,
    tag: "정보",
    festName: "2026 숭실 대동제",
  },
  {
    id: "c5",
    author: "새내기23",
    time: "1시간 전",
    body: "셔틀 막차 몇 시예요?",
    likes: 4,
    replies: 7,
    tag: "질문",
    festName: "2026 숭실 대동제",
  },
  {
    id: "c6",
    author: "IT학술제준비위",
    time: "2시간 전",
    body: "IT학술제 발표 팀 명단 공지 올라왔습니다 확인해주세요!",
    likes: 33,
    replies: 2,
    tag: "공지",
    festName: "제25회 IT대학 학술제",
  },
];

const TAGS = ["전체", "정보", "질문", "공지"];

export default function CommunityPage() {
  const [tag, setTag] = useState("전체");
  const [text, setText] = useState("");
  const [list, setList] = useState(POSTS);

  const filtered = tag === "전체" ? list : list.filter((p) => p.tag === tag);

  const send = () => {
    if (!text.trim()) return;
    setList([
      {
        id: `new-${Date.now()}`,
        author: "나",
        time: "방금",
        body: text,
        likes: 0,
        replies: 0,
        tag: "정보",
      },
      ...list,
    ]);
    setText("");
  };

  return (
    <>
      <div className="f-tagline">Community · 커뮤니티</div>
      <h1 className="f-h" style={{ marginBottom: 24 }}>
        커뮤니티
      </h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          className="f-input"
          placeholder="실시간으로 정보를 공유해보세요 · 익명"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="f-btn accent" onClick={send}>
          올리기
        </button>
      </div>

      <div className="f-day-row" style={{ marginBottom: 20 }}>
        {TAGS.map((t) => (
          <button
            key={t}
            className="f-chip"
            data-active={tag === t ? "true" : "false"}
            onClick={() => setTag(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="f-comm-list">
        {filtered.map((p) => (
          <div key={p.id} className="f-comm-row">
            <div className="head">
              <b>{p.author}</b>
              <span>·</span>
              <span>{p.time}</span>
              {p.festName && (
                <>
                  <span>·</span>
                  <span style={{ color: "var(--accent)", fontSize: 11 }}>
                    {p.festName}
                  </span>
                </>
              )}
            </div>
            <div className="text">{p.body}</div>
            <div className="foot">
              <span>♡ {p.likes}</span>
              <span>💬 {p.replies}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
