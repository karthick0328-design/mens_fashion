import React from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  categoryName = 'Clothing',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center space-x-2">
            <Ruler className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-900">
              Standard {categoryName} Size Guide (Inches)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Chest (in)</th>
                <th className="py-2.5 px-3">Waist (in)</th>
                <th className="py-2.5 px-3">Length (in)</th>
                <th className="py-2.5 px-3">Shoulder (in)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800">
              <tr className="hover:bg-neutral-50">
                <td className="py-2.5 px-3 font-bold">S</td>
                <td className="py-2.5 px-3">38.0</td>
                <td className="py-2.5 px-3">32.0</td>
                <td className="py-2.5 px-3">27.5</td>
                <td className="py-2.5 px-3">17.0</td>
              </tr>
              <tr className="hover:bg-neutral-50 bg-amber-50/30">
                <td className="py-2.5 px-3 font-bold text-amber-900">M</td>
                <td className="py-2.5 px-3">40.0</td>
                <td className="py-2.5 px-3">34.0</td>
                <td className="py-2.5 px-3">28.5</td>
                <td className="py-2.5 px-3">17.5</td>
              </tr>
              <tr className="hover:bg-neutral-50">
                <td className="py-2.5 px-3 font-bold">L</td>
                <td className="py-2.5 px-3">42.0</td>
                <td className="py-2.5 px-3">36.0</td>
                <td className="py-2.5 px-3">29.5</td>
                <td className="py-2.5 px-3">18.5</td>
              </tr>
              <tr className="hover:bg-neutral-50">
                <td className="py-2.5 px-3 font-bold">XL</td>
                <td className="py-2.5 px-3">44.0</td>
                <td className="py-2.5 px-3">38.0</td>
                <td className="py-2.5 px-3">30.5</td>
                <td className="py-2.5 px-3">19.5</td>
              </tr>
              <tr className="hover:bg-neutral-50">
                <td className="py-2.5 px-3 font-bold">XXL</td>
                <td className="py-2.5 px-3">46.0</td>
                <td className="py-2.5 px-3">40.0</td>
                <td className="py-2.5 px-3">31.5</td>
                <td className="py-2.5 px-3">20.5</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-5 p-3 rounded bg-neutral-50 text-[11px] text-neutral-500 space-y-1">
            <p>• <strong>How to measure:</strong> For chest, measure around the fullest part under arms.</p>
            <p>• If you prefer a relaxed or layered fit, we recommend ordering one size up.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
