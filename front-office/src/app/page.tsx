"use client";

export default function MainPage() {
  return (
    <div className="flex flex-col gap-[32px] py-[20px]">
      <section>
        <h1 className="text-txt-base text-[24px] font-bold md:text-[32px]">
          현재 진행 중인 축제
        </h1>
        <p className="text-txt-sub mt-[8px] text-[16px]">
          지금 바로 참여할 수 있는 축제 정보를 확인해보세요.
        </p>
      </section>

      {/* 축제 목록 (임시) */}
      <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((id) => (
          <div
            key={id}
            className="bs-border-base bg-bg-white overflow-hidden rounded-[16px] transition-shadow hover:shadow-lg"
          >
            <div className="bg-bg-gray aspect-video w-full" />
            <div className="p-[20px]">
              <div className="flex items-center gap-[8px]">
                <span className="bg-bg-primary/10 text-txt-primary rounded-[4px] px-[8px] py-[2px] text-[12px] font-semibold">
                  진행중
                </span>
                <span className="text-txt-sub text-[14px]">
                  2026.04.01 ~ 04.30
                </span>
              </div>
              <h3 className="text-txt-base mt-[12px] text-[18px] font-bold">
                제 {id}회 숭실대학교 대동제
              </h3>
              <p className="text-txt-sub mt-[8px] line-clamp-2 text-[14px]">
                축제에 대한 간단한 설명이 들어가는 공간입니다. 다양한 프로그램과
                먹거리가 준비되어 있습니다.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
