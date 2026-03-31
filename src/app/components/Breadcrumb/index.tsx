"use client";

import { Fragment, ReactNode, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

// 메뉴 아이템 타입 정의
interface MenuItem {
  label: string;
  /** breadcrumb에서 숨김 처리 (true면 표시하지 않고 children으로 넘어감) */
  isHide?: boolean;
  children?: Record<string, MenuItem>;
}

// MENU_ITEMS 상수 - 필요에 따라 수정하세요
// 키값은 URL pathname의 각 segment와 매칭됩니다
// depth 3까지 지원 (예: banners > edit > [id])
const MENU_ITEMS: Record<string, MenuItem> = {
  // /admin 경로 (isHide로 breadcrumb에서 숨김)
  admin: {
    label: "관리자",
    isHide: true,
    children: {
      banners: {
        label: "배너 관리",
        children: {
          add: { label: "등록" },
          edit: {
            label: "수정",
            children: {
              "[id]": { label: "" },
            },
          },
          "[id]": { label: "상세" },
        },
      },
      notice: {
        label: "공지사항",
        children: {
          "[id]": { label: "상세" },
        },
      },
      members: {
        label: "회원 관리",
        children: {
          list: { label: "목록" },
          "[id]": { label: "상세" },
        },
      },
      settings: {
        label: "설정",
        children: {
          general: { label: "일반" },
          notifications: { label: "알림" },
        },
      },
    },
  },
  // 유저 페이지 경로 (/banners, /notice 등)
  banners: {
    label: "배너",
    children: {
      "[id]": { label: "상세" },
    },
  },
  notice: {
    label: "공지사항",
    children: {
      "[id]": { label: "상세" },
    },
  },
};

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  /** 홈 링크 표시 여부 (기본값: true) */
  isShowHome?: boolean;
  /** 홈 라벨 (기본값: "홈") */
  homeLabel?: string;
  /** 커스텀 구분자 (기본값: ChevronRight 아이콘) */
  separator?: ReactNode;
  /** 커스텀 MENU_ITEMS (기본값: 내장 MENU_ITEMS) */
  menuItems?: Record<string, MenuItem>;
  /** 추가 CSS 클래스 */
  className?: string;
}

export default function Breadcrumb({
  isShowHome = true,
  homeLabel = "홈",
  separator,
  menuItems = MENU_ITEMS,
  className = "",
}: BreadcrumbProps) {
  const defaultSeparator = <ChevronRight className="h-4 w-4" />;
  const separatorElement = separator ?? defaultSeparator;
  const pathname = usePathname();

  const breadcrumbItems = useMemo(() => {
    const items: BreadcrumbItem[] = [];

    // pathname을 "/" 기준으로 split (빈 문자열 제거)
    const segments = pathname.split("/").filter(Boolean);

    // 홈 경로 계산 (isHide인 prefix들의 경로)
    let homeHref = "/";
    let currentMenuLevel: Record<string, MenuItem> | null = menuItems;

    // isHide인 prefix를 찾아서 홈 경로에 포함
    for (const segment of segments) {
      if (!currentMenuLevel) break;

      const hiddenMenuItem: MenuItem | null = currentMenuLevel[segment] ?? null;
      if (hiddenMenuItem?.isHide) {
        homeHref += segment + "/";
        currentMenuLevel = hiddenMenuItem.children ?? null;
      } else {
        break;
      }
    }

    // 홈 추가
    if (isShowHome) {
      items.push({
        label: homeLabel,
        href: homeHref.replace(/\/$/, "") || "/",
      });
    }

    if (segments.length === 0) {
      return items;
    }

    let currentPath = "";
    currentMenuLevel = menuItems;

    for (const segment of segments) {
      currentPath += `/${segment}`;

      if (!currentMenuLevel) break;

      // 정확히 매칭되는 키 찾기
      let menuItem: MenuItem | null = currentMenuLevel[segment] ?? null;

      // 정확한 매칭이 없으면 동적 라우트 패턴 찾기
      if (!menuItem) {
        const keys: string[] = Object.keys(currentMenuLevel);
        for (const key of keys) {
          if (key.startsWith("[") && key.endsWith("]")) {
            menuItem = currentMenuLevel[key];
            break;
          }
        }
      }

      if (menuItem) {
        // isHide가 true이거나 라벨이 빈 문자열이면 breadcrumb에 추가하지 않음
        if (!menuItem.isHide && menuItem.label) {
          items.push({
            label: menuItem.label,
            href: currentPath,
          });
        }
        currentMenuLevel = menuItem.children ?? null;
      } else {
        // MENU_ITEMS에 정의되지 않은 경우 segment 자체를 라벨로 사용
        items.push({
          label: segment,
          href: currentPath,
        });
        currentMenuLevel = null;
      }
    }

    return items;
  }, [pathname, isShowHome, homeLabel, menuItems]);

  // breadcrumb 아이템이 없으면 표시하지 않음
  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm text-slate-600 ${className}`}
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <Fragment key={item.href}>
            {index > 0 && (
              <span className="text-slate-400" aria-hidden="true">
                {separatorElement}
              </span>
            )}
            {isLast ? (
              <span className="font-medium text-slate-900" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="transition-colors hover:text-slate-900"
              >
                {item.label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

// 상수 및 타입 export
export { MENU_ITEMS };
export type { MenuItem, BreadcrumbItem, BreadcrumbProps };
