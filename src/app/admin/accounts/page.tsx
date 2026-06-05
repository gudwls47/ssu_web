"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState, deleteAccount, type UserRole } from "@/app/api/auth";
import {
  useGetAllUsers,
  useUpdateUserRole,
  useUpdateUserOrganization,
} from "@/app/api/users";
import Modal from "@/app/components/Modal";

type ConfirmState = {
  uid: string;
  displayName: string;
  nextRole: UserRole;
} | null;

const ROLE_META: Record<
  UserRole,
  { label: string; color: string; bg: string }
> = {
  admin: { label: "ADMIN", color: "#fff", bg: "var(--accent)" },
  user: { label: "USER", color: "var(--muted)", bg: "var(--faint)" },
};

function RoleBadge({ role }: { role: UserRole }) {
  const m = ROLE_META[role];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 22,
        padding: "0 8px",
        borderRadius: 6,
        fontSize: 11,
        fontFamily: "var(--mono-font), monospace",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        background: m.bg,
        color: m.color,
        whiteSpace: "nowrap",
      }}
    >
      {m.label}
    </span>
  );
}

export default function AccountsPage() {
  const router = useRouter();
  const { user: me } = useAuthState();
  const { data: users = [], isLoading } = useGetAllUsers();
  const updateRole = useUpdateUserRole();
  const updateOrg = useUpdateUserOrganization();
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [editingOrgUid, setEditingOrgUid] = useState<string | null>(null);
  const [editingOrgValue, setEditingOrgValue] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");

  // 회원탈퇴
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const isGoogle =
    me?.providerData.some((p) => p.providerId === "google.com") ?? false;

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await deleteAccount(isGoogle ? "" : deletePassword);
      router.replace("/");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setDeleteError("비밀번호가 올바르지 않습니다.");
      } else if (code === "auth/popup-closed-by-user") {
        setDeleteError("구글 인증 창이 닫혔습니다.");
      } else {
        setDeleteError(
          (err as { message?: string }).message ||
            "탈퇴 중 오류가 발생했습니다.",
        );
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered =
    roleFilter === "ALL" ? users : users.filter((u) => u.role === roleFilter);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;

  const handleConfirm = () => {
    if (!confirm) return;
    updateRole.mutate({ uid: confirm.uid, role: confirm.nextRole });
    setConfirm(null);
  };

  if (isLoading) {
    return (
      <div
        style={{
          padding: "24px 32px",
          color: "var(--muted)",
          fontFamily: "var(--mono-font), monospace",
          fontSize: 15,
        }}
      >
        불러오는 중…
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom: 4 }}>
        <div
          style={{
            fontFamily: "var(--mono-font), monospace",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 6,
          }}
        >
          ADMIN / 계정 관리
        </div>
        <div
          style={{
            fontFamily: "var(--display-font), sans-serif",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
            lineHeight: 1,
          }}
        >
          계정 관리{" "}
          <span
            style={{ color: "var(--muted)", fontSize: 24, fontWeight: 500 }}
          >
            {users.length}
          </span>
        </div>
      </div>

      {/* Stats strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginTop: 24,
          marginBottom: 24,
        }}
      >
        {(
          [
            {
              label: "전체",
              value: users.length,
              filter: "ALL" as const,
              accent: null,
            },
            {
              label: "Admin",
              value: adminCount,
              filter: "admin" as const,
              accent: "var(--accent)",
            },
            {
              label: "User",
              value: userCount,
              filter: "user" as const,
              accent: null,
            },
          ] satisfies {
            label: string;
            value: number;
            filter: "ALL" | UserRole;
            accent: string | null;
          }[]
        ).map((s) => (
          <div
            key={s.label}
            onClick={() =>
              setRoleFilter(s.filter === roleFilter ? "ALL" : s.filter)
            }
            style={{
              padding: 16,
              borderRadius: 14,
              background: "var(--surface)",
              border: `1px solid ${
                s.filter === roleFilter
                  ? (s.accent ?? "var(--accent)")
                  : "var(--border)"
              }`,
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono-font), monospace",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: "var(--display-font), sans-serif",
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginTop: 4,
                color: s.accent ?? "var(--fg)",
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        style={{
          borderRadius: 14,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {/* Head */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 200px 160px 120px 120px",
            padding: "12px 18px",
            borderBottom: "1px solid var(--border)",
            fontFamily: "var(--mono-font), monospace",
            fontSize: 12,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: ".06em",
            fontWeight: 500,
          }}
        >
          <span>이름 / 이메일</span>
          <span>소속 기관</span>
          <span>가입일</span>
          <span>역할</span>
          <span />
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 15,
              fontFamily: "var(--mono-font), monospace",
            }}
          >
            계정이 없습니다.
          </div>
        ) : (
          filtered.map((u, i) => {
            const isMe = u.uid === me?.uid;
            return (
              <div
                key={u.uid}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 200px 160px 120px 120px",
                  padding: "14px 18px",
                  borderBottom:
                    i < filtered.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                  alignItems: "center",
                  opacity: isMe ? 0.6 : 1,
                }}
              >
                {/* 이름 / 이메일 */}
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 15,
                      color: "var(--fg)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {u.displayName || "—"}
                    {isMe && (
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "var(--mono-font), monospace",
                          color: "var(--muted)",
                          border: "1px solid var(--border)",
                          borderRadius: 4,
                          padding: "1px 5px",
                        }}
                      >
                        나
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--mono-font), monospace",
                      fontSize: 13,
                      color: "var(--muted)",
                      marginTop: 2,
                    }}
                  >
                    {u.email}
                  </div>
                </div>

                {/* 소속 기관 */}
                <div>
                  {editingOrgUid === u.uid ? (
                    <div
                      style={{ display: "flex", gap: 4, alignItems: "center" }}
                    >
                      <input
                        value={editingOrgValue}
                        onChange={(e) => setEditingOrgValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateOrg.mutate({
                              uid: u.uid,
                              organization: editingOrgValue.trim(),
                            });
                            setEditingOrgUid(null);
                          }
                          if (e.key === "Escape") setEditingOrgUid(null);
                        }}
                        style={{
                          fontSize: 13,
                          fontFamily: "var(--mono-font), monospace",
                          padding: "3px 8px",
                          border: "1px solid var(--accent)",
                          borderRadius: 6,
                          background: "var(--bg)",
                          color: "var(--fg)",
                          width: 120,
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={() => {
                          updateOrg.mutate({
                            uid: u.uid,
                            organization: editingOrgValue.trim(),
                          });
                          setEditingOrgUid(null);
                        }}
                        style={{
                          fontSize: 11,
                          padding: "3px 8px",
                          borderRadius: 6,
                          border: "none",
                          background: "var(--accent)",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingOrgUid(null)}
                        style={{
                          fontSize: 11,
                          padding: "3px 8px",
                          borderRadius: 6,
                          border: "1px solid var(--border)",
                          background: "none",
                          color: "var(--muted)",
                          cursor: "pointer",
                        }}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setEditingOrgUid(u.uid);
                        setEditingOrgValue(u.organization || "");
                      }}
                      title="클릭하여 수정"
                      style={{
                        fontSize: 14,
                        color: u.organization ? "var(--fg)" : "var(--muted)",
                        fontFamily: "var(--mono-font), monospace",
                        cursor: "pointer",
                        padding: "3px 6px",
                        borderRadius: 6,
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--faint)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {u.organization || "—"}
                    </div>
                  )}
                </div>

                {/* 가입일 */}
                <div
                  style={{
                    fontFamily: "var(--mono-font), monospace",
                    fontSize: 13,
                    color: "var(--muted)",
                  }}
                >
                  {u.createdAt
                    ? new Date(u.createdAt.seconds * 1000).toLocaleDateString(
                        "ko-KR",
                      )
                    : "—"}
                </div>

                {/* 역할 */}
                <div>
                  <RoleBadge role={u.role} />
                </div>

                {/* 역할 변경 */}
                <div style={{ display: "flex", gap: 4 }}>
                  {isMe ? (
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--muted)",
                        fontFamily: "var(--mono-font), monospace",
                      }}
                    >
                      —
                    </span>
                  ) : (
                    (["admin", "user"] as UserRole[])
                      .filter((r) => r !== u.role)
                      .map((nextRole) => (
                        <button
                          key={nextRole}
                          className={`f-btn sm ${nextRole === "admin" ? "accent" : "ghost"}`}
                          style={{ fontSize: 11, padding: "0 8px" }}
                          onClick={() =>
                            setConfirm({
                              uid: u.uid,
                              displayName: u.displayName || u.email,
                              nextRole,
                            })
                          }
                        >
                          {ROLE_META[nextRole].label}
                        </button>
                      ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 내 계정 탈퇴 섹션 */}
      <div
        style={{
          marginTop: 40,
          paddingTop: 24,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono-font)",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 12,
          }}
        >
          내 계정 관리
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            background: "none",
            border: "1px solid #e53e3e40",
            borderRadius: 10,
            padding: "10px 16px",
            color: "#e53e3e",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e53e3e10")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          회원탈퇴
        </button>
      </div>

      {/* 회원탈퇴 모달 */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteError("");
            setDeletePassword("");
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: 28,
              width: 400,
              maxWidth: "calc(100vw - 40px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 22, marginBottom: 8 }}>⚠️</div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 8,
                color: "var(--fg)",
              }}
            >
              정말 탈퇴하시겠어요?
            </div>
            <div
              style={{
                fontSize: 14,
                color: "var(--muted)",
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              탈퇴하면 계정 정보와 등록된 모든 축제 데이터가{" "}
              <b style={{ color: "#e53e3e" }}>영구 삭제</b>되며 복구할 수
              없습니다.
            </div>
            {!isGoogle && (
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--fg)",
                    marginBottom: 6,
                  }}
                >
                  비밀번호 확인
                </div>
                <input
                  className="a-input"
                  type="password"
                  placeholder="현재 비밀번호 입력"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    height: 40,
                    padding: "0 12px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--fg)",
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}
            {deleteError && (
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "rgba(229,62,62,0.1)",
                  color: "#e53e3e",
                  fontSize: 14,
                  marginBottom: 16,
                }}
              >
                {deleteError}
              </div>
            )}
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button
                className="f-btn ghost sm"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError("");
                  setDeletePassword("");
                }}
              >
                취소
              </button>
              <button
                className="f-btn sm"
                onClick={handleDeleteAccount}
                disabled={deleteLoading || (!isGoogle && !deletePassword)}
                style={{ background: "#e53e3e", color: "#fff", border: "none" }}
              >
                {deleteLoading
                  ? "처리 중…"
                  : isGoogle
                    ? "Google 인증 후 탈퇴"
                    : "탈퇴하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 확인 모달 */}
      <Modal
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="역할 변경"
        cancelButtonText="취소"
        submitButtonText="변경"
        onClickSubmit={handleConfirm}
      >
        <span style={{ fontSize: 15, color: "var(--fg)" }}>
          <strong>{confirm?.displayName}</strong>님의 역할을{" "}
          <strong>{confirm ? ROLE_META[confirm.nextRole].label : ""}</strong>
          (으)로 변경하시겠습니까?
        </span>
      </Modal>
    </div>
  );
}
