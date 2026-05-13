"use client";

import Script from "next/script";
import FestivalCard from "@/app/components/FestivalCard";
import { useGetFestivals } from "./api/festivals";

declare global {
  interface Window {
    naver: any;
  }
}

type FestivalStatus = "live" | "upcoming" | "ended";

interface Festival {
  id: string;
  name: string;
  en: string;
  school: string;
  start: string;
  end: string;
  status: FestivalStatus;
  participants: number;
  tagline: string;
  colors: [string, string, string];
}

const FESTIVALS: Festival[] = [
  {
    id: "ssu-daedongje-2026",
    name: "2026 숭실 대동제",
    en: "DAEDONGJE",
    school: "숭실대학교",
    start: "2026-05-12",
    end: "2026-05-14",
    status: "live",
    participants: 8420,
    tagline: "숭실의 봄이 깨어나다",
    colors: ["#FF1E7A", "#BDFF1E", "#2A0F4E"],
  },
  {
    id: "ssu-itfest-2026",
    name: "제25회 IT대학 학술제",
    en: "IT FESTA",
    school: "숭실대학교",
    start: "2026-05-20",
    end: "2026-05-22",
    status: "upcoming",
    participants: 3200,
    tagline: "기술과 축제의 만남",
    colors: ["#6B2EE6", "#BDFF1E", "#1B0832"],
  },
  {
    id: "ssu-sportsfest-2026",
    name: "2026 숭실 체육대회",
    en: "SPORTS FEST",
    school: "숭실대학교",
    start: "2026-06-05",
    end: "2026-06-05",
    status: "upcoming",
    participants: 2100,
    tagline: "하나 되는 숭실인",
    colors: ["#FF7A66", "#F2C94C", "#14172B"],
  },
  {
    id: "ssu-artfest-2026",
    name: "숭실 예술문화제",
    en: "ART WAVE",
    school: "숭실대학교",
    start: "2026-06-18",
    end: "2026-06-20",
    status: "upcoming",
    participants: 1800,
    tagline: "예술로 물드는 캠퍼스",
    colors: ["#00CFE6", "#FF00B8", "#0A0A0F"],
  },
  {
    id: "ssu-daedongje-2025",
    name: "2025 숭실 대동제",
    en: "DAEDONGJE 2025",
    school: "숭실대학교",
    start: "2025-09-20",
    end: "2025-09-22",
    status: "ended",
    participants: 7800,
    tagline: "지난 가을의 추억",
    colors: ["#E85D4A", "#FBF6EC", "#14172B"],
  },
  {
    id: "ssu-itfest-2025",
    name: "제24회 IT대학 학술제",
    en: "IT FESTA 2025",
    school: "숭실대학교",
    start: "2025-05-18",
    end: "2025-05-20",
    status: "ended",
    participants: 2900,
    tagline: "코드로 쓰는 축제",
    colors: ["#3D6EE6", "#F2C94C", "#14172B"],
  },
];

export default function MainPage() {
  const { data: upcomingData } = useGetFestivals({
    page: 1,
    status: "UPCOMING",
  });
  const { data: endedData } = useGetFestivals({ page: 1, status: "ENDED" });

  console.log(upcomingData);
  console.log(endedData);

  return (
    <div>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onReady={() => {
          if (typeof window.naver !== "undefined") {
            const mapOptions = {
              center: new window.naver.maps.LatLng(37.4963, 126.9574),
              zoom: 16,
              minZoom: 10,
              zoomControl: true,
              zoomControlOptions: {
                position: window.naver.maps.Position.TOP_RIGHT,
              },
            };

            const map = new window.naver.maps.Map("map", mapOptions);

            // eslint-disable-next-line no-new
            new window.naver.maps.Marker({
              position: new window.naver.maps.LatLng(37.4963, 126.9574),
              map,
              title: "숭실대학교",
            });
          }
        }}
      />
      <div
        id="map"
        style={{
          width: "100%",
          height: "400px",
          borderRadius: "24px",
          marginTop: "24px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          border: "1px solid rgba(0,0,0,0.05)",
          backgroundColor: "#f0f0f0",
        }}
      />
      <section style={{ marginTop: 64 }}>
        <div className="f-h-row">
          <div>
            <div className="f-tagline">Upcoming · 다가오는 축제</div>
            <h2 className="f-h">곧 시작해요</h2>
          </div>
          <div className="f-sub">{upcomingData?.length || 0}개 예정</div>
        </div>
        <div className="f-grid">
          {!upcomingData || upcomingData.length < 1 ? (
            <p>데이터가 없습니다.</p>
          ) : (
            upcomingData.map((v) => <FestivalCard key={v.id} data={v} />)
          )}
        </div>
      </section>

      <section style={{ marginTop: 64 }}>
        <div className="f-h-row">
          <div>
            <div className="f-tagline">Archive · 지나간 축제</div>
            <h2 className="f-h">놓친 거 다시 보기</h2>
          </div>
        </div>
        <div className="f-grid">
          {!endedData || endedData?.length < 1 ? (
            <p>데이터가 없습니다.</p>
          ) : (
            endedData.map((v) => <FestivalCard key={v.id} data={v} />)
          )}
        </div>
      </section>
    </div>
  );
}
