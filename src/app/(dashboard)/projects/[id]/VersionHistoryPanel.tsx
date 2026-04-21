"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Version {
  id: string;
  version: number;
  name: string;
  createdAt: Date | string;
}

interface Props {
  projectId: string;
  versions: Version[];
}

export default function VersionHistoryPanel({ projectId, versions: initial }: Props) {
  const router = useRouter();
  const [versions, setVersions] = useState<Version[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  async function deleteVersion(versionId: string) {
    setBusy(versionId);
    const res = await fetch(`/api/projects/${projectId}/versions/${versionId}`, { method: "DELETE" });
    setBusy(null);
    setConfirm(null);
    if (res.ok) {
      setVersions(v => v.filter(x => x.id !== versionId));
    }
  }

  async function restoreVersion(versionId: string) {
    setBusy(versionId);
    const res = await fetch(`/api/projects/${projectId}/versions/${versionId}`, { method: "PATCH" });
    setBusy(null);
    if (res.ok) {
      router.refresh();
    }
  }

  if (versions.length === 0) return null;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm">🕐</span>
        <p className="font-bold text-stone-900 text-sm">Version History</p>
        <span className="text-xs text-stone-400">{versions.length} saved version{versions.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="space-y-2">
        {versions.map(v => (
          <div
            key={v.id}
            className="flex items-center justify-between bg-stone-50 rounded-xl px-4 py-2.5"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full">
                  v{v.version}
                </span>
                <span className="text-sm font-semibold text-stone-700">{v.name}</span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Saved {new Date(v.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                  hour: "numeric", minute: "2-digit",
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Restore */}
              <button
                disabled={busy === v.id}
                onClick={() => restoreVersion(v.id)}
                className="text-xs font-bold text-amber-700 hover:text-amber-600 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
              >
                {busy === v.id ? "…" : "Restore"}
              </button>

              {/* Delete */}
              {confirm === v.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => deleteVersion(v.id)}
                    disabled={busy === v.id}
                    className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {busy === v.id ? "…" : "Yes, delete"}
                  </button>
                  <button
                    onClick={() => setConfirm(null)}
                    className="text-xs font-bold text-stone-500 hover:bg-stone-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirm(v.id)}
                  className="text-xs font-bold text-stone-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-stone-400 mt-3">
        A new version is saved automatically each time you update your project via the design questionnaire.
        Restoring a version saves your current state first.
      </p>
    </div>
  );
}
