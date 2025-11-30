import { XCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button.jsx";
import { Input } from "./Input.jsx";

export function RejectReservationDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  candidateName,
}) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason(""); // Reset after confirming
    }
  };

  const handleClose = () => {
    setReason(""); // Reset on close
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 border border-secondary-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary-900">
              {t("reservations.rejectReservation", {
                defaultValue: "Reject Reservation",
              })}
            </h3>
          </div>
        </div>
        
        {candidateName && (
          <p className="text-sm text-secondary-600 mb-4">
            {t("reservations.rejectingFor", {
              defaultValue: "Rejecting reservation for",
            })}{" "}
            <span className="font-semibold">{candidateName}</span>
          </p>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {t("reservations.rejectionReason", {
              defaultValue: "Rejection Reason",
            })}{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("reservations.rejectionReasonPlaceholder", {
              defaultValue: "Please provide a reason for rejecting this reservation...",
            })}
            className="w-full min-h-[100px] px-4 py-2 text-sm border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all resize-none"
            disabled={isLoading}
            autoFocus
          />
          <p className="text-xs text-secondary-500 mt-1">
            {t("reservations.rejectionReasonHelp", {
              defaultValue: "This reason will be shown to the candidate",
            })}
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            {t("common.cancel", { defaultValue: "Cancel" })}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading
              ? t("common.loading", { defaultValue: "Loading..." })
              : t("reservations.reject", { defaultValue: "Reject" })}
          </Button>
        </div>
      </div>
    </div>
  );
}

