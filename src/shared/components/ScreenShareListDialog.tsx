import { DesktopCapturerSource } from "electron";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./shadcn-ui/dialog";

interface ScreenShareListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sources: DesktopCapturerSource[];
  onSourceSelect: (source: DesktopCapturerSource) => void;
}

const ScreenShareListDialog = ({
  isOpen,
  onClose,
  sources,
  onSourceSelect,
}: ScreenShareListDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Backdrop */}

      {/* Full-screen container to center the panel */}
      <DialogContent className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Select Screen to Share
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
          {sources.map((source) => (
            <button
              key={source.id}
              onClick={() => {
                onSourceSelect(source);
                onClose();
              }}
              className="group relative flex flex-col items-center p-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              {source.thumbnail && (
                <img
                  src={source.thumbnail.toDataURL()}
                  alt={source.name}
                  className="w-full h-32 object-contain rounded mb-2"
                />
              )}
              <span className="text-sm text-gray-700 text-center line-clamp-2">
                {source.name}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScreenShareListDialog;
