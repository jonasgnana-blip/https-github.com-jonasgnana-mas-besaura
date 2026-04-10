"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DateRange } from "@/app/actions/reservas";

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isUnavailable(date: Date, ranges: DateRange[]): boolean {
  const ds = formatDate(date);
  return ranges.some((r) => ds >= r.entrada && ds < r.salida);
}

function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

// ── CalendarMonth ──────────────────────────────────────────────────────────────

function CalendarMonth({
  year,
  month,
  selected,
  unavailableRanges,
  onDayClick,
}: {
  year: number;
  month: number;
  selected: Date | null;
  unavailableRanges: DateRange[];
  onDayClick: (d: Date) => void;
}) {
  const firstDay = new Date(year, month, 1);
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className="select-none">
      <div className="text-center font-medium text-[#2C1810] mb-3 text-sm tracking-wide">
        {MONTH_NAMES[month]} {year}
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-[10px] text-[#2C1810]/40 font-medium py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;

          const ds = formatDate(date);
          const past = isPast(date);
          const unavail = isUnavailable(date, unavailableRanges);
          const disabled = past || unavail;
          const isSelected = selected && sameDay(date, selected);

          const textCol = disabled
            ? "text-[#2C1810]/25"
            : isSelected
            ? "text-[#F0EAD6]"
            : "text-[#2C1810]";
          const bg = isSelected ? "bg-[#4A6741] rounded-full" : "";
          const cursor = disabled ? "cursor-not-allowed" : "cursor-pointer";

          return (
            <div key={ds} className="flex items-center justify-center">
              <button
                disabled={disabled}
                onClick={() => !disabled && onDayClick(date)}
                className={`
                  w-8 h-8 text-xs font-medium transition-all flex items-center justify-center
                  ${bg}
                  ${!isSelected && !disabled ? "hover:bg-[#4A6741]/10 rounded-full" : ""}
                  ${textCol} ${cursor}
                  ${unavail && !past ? "line-through opacity-40" : ""}
                `}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── SingleDatePicker ───────────────────────────────────────────────────────────

type Props = {
  unavailableDates: DateRange[];
  selected: string | null;
  onSelect: (date: string) => void;
  label?: string;
};

export default function SingleDatePicker({
  unavailableDates,
  selected,
  onSelect,
  label,
}: Props) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const selectedDate = selected ? parseDate(selected) : null;

  function handlePrev() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function handleNext() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleDayClick(date: Date) {
    onSelect(formatDate(date));
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-[#2C1810]">{label}</label>
      )}
      <div className="bg-[#FAFAF6] rounded-2xl border border-[#E8DCC8] p-4">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E8DCC8] transition-colors text-[#2C1810]"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex-1" />
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E8DCC8] transition-colors text-[#2C1810]"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Single month */}
        <CalendarMonth
          year={viewYear}
          month={viewMonth}
          selected={selectedDate}
          unavailableRanges={unavailableDates}
          onDayClick={handleDayClick}
        />

        {/* Selected date display */}
        <div className="mt-4 pt-3 border-t border-[#E8DCC8] text-xs text-[#2C1810]/60 min-h-[20px]">
          {selectedDate ? (
            <span className="text-[#4A6741] font-medium">
              {selectedDate.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          ) : (
            <span>Selecciona una fecha</span>
          )}
        </div>
      </div>
    </div>
  );
}
