import React from 'react';
import { MapPin, Filter, RefreshCw } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';

interface NoStationsFoundProps {
  onResetFilters?: () => void;
  onSearchArea?: () => void;
}

export function NoStationsFound({ onResetFilters, onSearchArea }: NoStationsFoundProps): React.ReactElement {
  return (
    <div className="p-6 rounded-3xl border border-slate-200 bg-white text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl grid place-items-center bg-slate-100">
        <MapPin className="h-7 w-7 text-slate-500" />
      </div>
      <div className="mt-3 text-[15px] font-semibold text-slate-800">No chargers match your filters</div>
      <div className="mt-1 text-[13px] text-slate-600">Try resetting filters or searching a wider area.</div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={onResetFilters}
          className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2 text-[13px]"
        >
          <Filter className="h-4 w-4" />
          Reset Filters
        </button>
        <button
          onClick={onSearchArea}
          className="h-11 rounded-xl text-white font-medium inline-flex items-center justify-center gap-2 text-[13px]"
          style={{ backgroundColor: EVZ_COLORS.orange }}
        >
          <RefreshCw className="h-4 w-4" />
          Search This Area
        </button>
      </div>
    </div>
  );
}
