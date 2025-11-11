// web/src/components/Toast.tsx
import type { FC } from "react";

type ToastProps = {
    message: string;
    onClose: () => void;
};

const Toast: FC<ToastProps> = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-black text-white text-sm px-3 py-2 rounded shadow-lg flex items-center gap-2">
            <span>{message}</span>
            <button
                type="button"
                className="text-xs underline"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    );
};

export default Toast;
