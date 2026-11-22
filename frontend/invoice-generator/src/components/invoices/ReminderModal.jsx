import { useEffect, useState } from "react";
import { Loader2, Mail, Copy, Check, X } from "lucide-react";
import Button from "../ui/Button";
import TextAreaField from "../ui/TextAreaField";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";

const ReminderModal = ({ isOpen, onClose, invoiceId }) => {
  const [reminderText, setReminderText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (isOpen && invoiceId) {
      const generateReminder = async () => {
        setIsLoading(true);
        setReminderText("");
        try {
          const response = await axiosInstance.post(
            API_PATHS.AI.GENERATE_REMINDER,
            { invoiceId },
          );
          if (isMounted) {
            setReminderText(response.data.reminderText || "");
          }
        } catch (error) {
          if (isMounted) {
            toast.error(
              error.response?.data?.message || "Failed to generate reminder",
            );
            console.error("AI reminder error:", error);
            onClose();
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      generateReminder();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, invoiceId]);

  const handleCopyToClipboard = async () => {
    if (!reminderText) return;
    try {
      await navigator.clipboard.writeText(reminderText);
      setHasCopied(true);
      toast.success("Reminder text copied to clipboard");
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy text to clipboard");
      console.error("Clipboard error:", err);
    }
  };

  // Safe early return after all hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal Card */}
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative text-left transform transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              AI Generated Reminder
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
              <p className="text-sm">Generating reminder with AI...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <TextAreaField
                label="Generated Reminder Message"
                name="reminderText"
                value={reminderText}
                onChange={(e) => setReminderText(e.target.value)}
                rows={10}
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleCopyToClipboard}
              disabled={isLoading || !reminderText}
              icon={hasCopied ? Check : Copy}
            >
              {hasCopied ? "Copied!" : "Copy Text"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
