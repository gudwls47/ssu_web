"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Script from "next/script";
import FestivalCard from "@/app/components/FestivalCard";
import MyFestivalWidget from "@/app/components/MyFestivalWidget";
import { useAuthState } from "./api/auth";
import { useGetFestivals } from "./api/festivals";
import { useGetMyFestivals } from "./api/userFestivals";

declare global {
  interface Window {
    naver: any;
  }
}

const SSU = { lat: 37.4956, lng: 126.9581 }; // 숭실대학교 정보과학관

export default function MainPage() {
  const { user, loading: authLoading } = useAuthState();
  const { data: myFestivals } = useGetMyFestivals(user?.uid);
  const hasJoined = !authLoading && !!user && (myFestivals?.length ?? 0) > 0;

  const { data: upcomingData } = useGetFestivals(
    { page: 1, status: "UPCOMING" },
    { staleTime: 0 },
  );
  const { data: liveData } = useGetFestivals(
    { page: 1, status: "LIVE" },
    { staleTime: 0 },
  );
  const { data: endedData } = useGetFestivals({ page: 1, status: "ENDED" });
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const addFestivalMarkers = (festivals: typeof liveData) => {
    if (!mapRef.current || typeof window.naver === "undefined") return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    (festivals ?? [])
      .filter((f) => f.lat && f.lng)
      .forEach((f) => {
        const isLive = f.status === "LIVE";
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(f.lat!, f.lng!),
          map: mapRef.current,
          title: f.name,
          icon: {
            content: `<div style="width:36px;height:44px;cursor:pointer;"><svg viewBox="0 0 36 44" width="36" height="44" xmlns="http://www.w3.org/2000/svg"><path d="M18 2C10.268 2 4 8.268 4 16c0 10 14 26 14 26S32 26 32 16C32 8.268 25.732 2 18 2z" fill="${isLive ? "#FF1E7A" : "#FF6BAD"}" stroke="white" stroke-width="1.5"/><circle cx="18" cy="16" r="6" fill="white"/>${isLive ? `<circle cx="18" cy="16" r="3" fill="#FF1E7A"/>` : ""}</svg></div>`,
            size: new window.naver.maps.Size(36, 44),
            anchor: new window.naver.maps.Point(18, 44),
          },
        });
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `<a href="/festival/${f.id}" style="display:block;padding:10px 14px;font-family:sans-serif;font-size:13px;font-weight:600;color:#111;min-width:120px;text-decoration:none;cursor:pointer;">${f.name}<div style="font-size:11px;font-weight:400;color:#888;margin-top:2px">${f.school}</div></a>`,
          borderWidth: 0,
          borderRadius: "12px",
          disableAnchor: false,
          backgroundColor: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        });
        window.naver.maps.Event.addListener(marker, "click", () => {
          if (infoWindow.getMap()) infoWindow.close();
          else infoWindow.open(mapRef.current, marker);
        });
        markersRef.current.push(marker);
      });
  };

  useEffect(() => {
    const allFestivals = [...(liveData ?? []), ...(upcomingData ?? [])];
    if (mapRef.current) {
      addFestivalMarkers(allFestivals);
    } else {
      const handler = () => addFestivalMarkers(allFestivals);
      window.addEventListener("naverMapReady", handler, { once: true });
      return () => window.removeEventListener("naverMapReady", handler);
    }
  }, [liveData, upcomingData]);

  return (
    <div>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onReady={() => {
          if (typeof window.naver === "undefined") return;
          mapRef.current = new window.naver.maps.Map("map", {
            center: new window.naver.maps.LatLng(SSU.lat, SSU.lng),
            zoom: 14,
            minZoom: 6,
            zoomControl: true,
            zoomControlOptions: {
              position: window.naver.maps.Position.TOP_RIGHT,
            },
          });
          // 숭실대 현재 위치 마커 (파란 점)
          // eslint-disable-next-line no-new
          new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(SSU.lat, SSU.lng),
            map: mapRef.current,
            title: "현재 위치",
            icon: {
              content: `<div style="width:16px;height:16px;background:#4A90E2;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(74,144,226,0.5);"></div>`,
              size: new window.naver.maps.Size(16, 16),
              anchor: new window.naver.maps.Point(8, 8),
            },
          });
          window.dispatchEvent(new Event("naverMapReady"));
        }}
      />
      {hasJoined && user ? (
        <MyFestivalWidget uid={user.uid} />
      ) : (
        <div
          style={{
            width: "100%",
            height: "400px",
            borderRadius: "24px",
            marginTop: "24px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
            border: "1px solid rgba(0,0,0,0.05)",
            overflow: "hidden",
            position: "relative",
            contain: "paint",
            transform: "translateZ(0)",
          }}
        >
          <div
            id="map"
            style={{
              position: "absolute",
              inset: 0,
            }}
          />
        </div>
      )}
      {liveData && liveData.length > 0 && (
        <section style={{ marginTop: 64 }}>
          <div className="f-h-row">
            <div>
              <div className="f-tagline">Live Now · 지금 이 순간</div>
              <h2 className="f-h">지금 하고 있어요</h2>
            </div>
            <Link
              href="/festival?status=LIVE"
              className="f-sub"
              style={{
                textDecoration: "none",
                color: "var(--accent)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {liveData.length}개 진행 중 →
            </Link>
          </div>
          <div className="f-grid">
            {liveData.map((v) => (
              <FestivalCard key={v.id} data={v} />
            ))}
          </div>
        </section>
      )}

      {upcomingData && upcomingData.length > 0 && (
        <section style={{ marginTop: 64 }}>
          <div className="f-h-row">
            <div>
              <div className="f-tagline">Upcoming · 다가오는 축제</div>
              <h2 className="f-h">곧 시작해요</h2>
            </div>
            <Link
              href="/festival?status=UPCOMING"
              className="f-sub"
              style={{
                textDecoration: "none",
                color: "var(--accent)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {upcomingData.length}개 예정 →
            </Link>
          </div>
          <div className="f-grid">
            {upcomingData.map((v) => (
              <FestivalCard key={v.id} data={v} />
            ))}
          </div>
        </section>
      )}

      {endedData && endedData.length > 0 && (
        <section style={{ marginTop: 64 }}>
          <div className="f-h-row">
            <div>
              <div className="f-tagline">Archive · 지나간 축제</div>
              <h2 className="f-h">이제 끝이 났어요</h2>
            </div>
            <Link
              href="/festival?status=ENDED"
              className="f-sub"
              style={{
                textDecoration: "none",
                color: "var(--accent)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {endedData.length}개 종료 →
            </Link>
          </div>
          <div className="f-grid">
            {endedData.map((v) => (
              <FestivalCard key={v.id} data={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
