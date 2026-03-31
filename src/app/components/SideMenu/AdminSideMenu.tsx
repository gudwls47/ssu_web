"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cva } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/shadcn/components/ui/accordion";
import { cn } from "@/app/shadcn/lib/utils";

interface MenuItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
  children?: MenuItem[];
  requiredPermission?: string;
  requireSuperAdmin?: boolean;
}

const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    label: "대시보드",
    href: "/admin/dashboard",
  },
  {
    label: "회원",
    href: "/admin/members",
    requiredPermission: "MEMBER_READ",
  },
  {
    label: "아이템",
    href: "/admin/items",
    requiredPermission: "BLACKLIST_READ",
  },
  {
    label: "배너",
    href: "/admin/banners",
    requiredPermission: "BANNER_READ",
  },
];

const menuItemVariants = cva(
  "flex items-center gap-3 px-6 h-[48px] text-sm font-medium transition-colors",
  {
    variants: {
      isActive: {
        true: "bg-bg-primary [&>span]:text-txt-primary",
        false: "hover:bg-bg-lightGray",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

const subMenuItemVariants = cva(
  "block px-3 py-2 pl-11 text-sm transition-colors",
  {
    variants: {
      isActive: {
        true: "bg-bg-primary [&>span]:text-txt-primary",
        false: "hover:bg-bg-lightGray",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

export default function AdminSideMenu() {
  const pathname = usePathname();

  const isActiveLink = (href: string) => pathname.startsWith(href);

  const isActiveParent = (children: MenuItem[]) =>
    children.some((child) => child.href && pathname.startsWith(child.href));

  const renderMenuItem = (item: MenuItem, index: number) => {
    const Icon = item.icon;

    if (item.href && !item.children) {
      return (
        <Link
          key={index}
          href={item.href}
          className={menuItemVariants({ isActive: isActiveLink(item.href) })}
        >
          {Icon && <Icon className="size-5" />}
          <span>{item.label}</span>
        </Link>
      );
    }

    if (item.children && item.children.length > 0) {
      const isParentActive = isActiveParent(item.children);

      return (
        <Accordion
          key={index}
          type="single"
          collapsible
          defaultValue={isParentActive ? `item-${index}` : void 0}
        >
          <AccordionItem value={`item-${index}`} className="border-none">
            <AccordionTrigger
              className={cn(
                "cursor-pointer px-3 py-2.5 hover:no-underline",
                isParentActive
                  ? "text-font-mainText"
                  : "text-font-subText01 hover:bg-bg-lightGray hover:text-font-mainText",
              )}
            >
              <div className="flex items-center gap-3">
                {Icon && <Icon className="size-5" />}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-0">
              <div className="flex flex-col gap-1">
                {item.children.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    href={child.href || "#"}
                    className={subMenuItemVariants({
                      isActive: child.href ? isActiveLink(child.href) : false,
                    })}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }

    return null;
  };

  return (
    <div className="br-border-base sticky top-0 flex h-screen w-[280px] shrink-0 flex-col py-[40px]">
      <div className="flex-center mb-[40px] h-[80px]">
        <p>LOGO</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {ADMIN_MENU_ITEMS.map((item, index) => renderMenuItem(item, index))}
        </div>
      </div>
    </div>
  );
}

export { ADMIN_MENU_ITEMS };
export type { MenuItem };
