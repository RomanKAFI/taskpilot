// web/src/components/Toast.tsx
import { useEffect, useState } from "react";

type Toast = { type: "success" | "error"; text: string };

export default function Toast() {
    const [msg, setMsg] = useState<Toast | null>(null);

    useEffect(() => {
        const onToast = (e: Event) => {
            const detail = (e as CustomEvent).detail as Toast;
            setMsg(detail);
            const t = setTimeout(() => setMsg(null), 2500);
            return () => clearTimeout(t);
        };
        window.addEventListener("toast", onToast as any);
        return () => window.removeEventListener("toast", onToast as any);
    }, []);

    if (!msg) return null;

    const base =
        "fixed bottom-4 right-4 px-4 py-2 rounded-xl shadow-lg text-sm";
    const color =
        msg.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white";

    return <div className={`${base} ${color}`}>{msg.text}</div>;
}
