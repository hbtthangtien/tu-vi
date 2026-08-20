/**
 * Thuật toán Lịch Âm Việt Nam (Vietnamese Lunar Calendar)
 * Tác giả gốc: TS. Hồ Ngọc Đức (Viện Công nghệ Thông tin Leipzig)
 * Tính toán thiên văn chính xác điểm Sóc (New Moon) và Trung Khí (Sun Longitude) tại múi giờ UTC+7.0.
 */

import { VI_STEMS, VI_BRANCHES } from './constants';

const PI = Math.PI;

function INT(d: number): number {
  return Math.floor(d);
}

/**
 * Chuyển ngày Dương lịch (Gregorian) sang số ngày Julian (Julian Day Number)
 */
export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
}

/**
 * Chuyển số ngày Julian (JDN) về ngày Dương lịch
 */
export function jdToDate(jd: number): { day: number; month: number; year: number } {
  let a: number;
  if (jd < 2299161) {
    a = jd;
  } else {
    const alpha = INT((jd - 1867216.25) / 36524.25);
    a = jd + 1 + alpha - INT(alpha / 4);
  }
  const b = a + 1524;
  const c = INT((b - 122.1) / 365.25);
  const d = INT(365.25 * c);
  const e = INT((b - d) / 30.6001);
  const day = b - d - INT(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  return { day, month, year };
}

/**
 * Tính ngày Sóc (New Moon) thứ k theo múi giờ chỉ định (mặc định UTC+7 cho Việt Nam)
 */
export function getNewMoonDay(k: number, timeZone: number = 7.0): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * M * dr);
  C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * Mpr * dr);
  C1 -= 0.0004 * Math.sin(3 * Mpr * dr);
  C1 += 0.0104 * Math.sin(2 * F * dr) - 0.0051 * Math.sin((M + Mpr) * dr);
  C1 -= 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
  C1 -= 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
  C1 += 0.001 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((M + 2 * Mpr) * dr);
  return INT(Jd1 + C1 + 0.5 + timeZone / 24.0);
}

/**
 * Tính kinh độ Mặt Trời (Sun Longitude) để xác định các Tiết Khí
 */
export function getSunLongitude(dayNumber: number, timeZone: number = 7.0): number {
  const T = (dayNumber - 2451545.5 - timeZone / 24.0) / 36525.0;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * dr);
  DL += (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr) + 0.00029 * Math.sin(3 * M * dr);
  let L = (L0 + DL) * dr;
  L = L - PI * 2 * INT(L / (PI * 2));
  return INT((L / PI) * 6); // Trả về số nguyên 0-11
}

/**
 * Tìm ngày bắt đầu tháng 11 âm lịch (tháng chứa Đông chí)
 */
export function getLunarMonth11(yy: number, timeZone: number = 7.0): number {
  let off = jdFromDate(31, 12, yy) - 2415021;
  let k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  let sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

/**
 * Tìm vị trí tháng nhuận
 */
export function getLeapMonthOffset(a11: number, timeZone: number = 7.0): number {
  let k = INT((a11 - 2415021.076998695) / 29.53058868 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

export interface LunarDateResult {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
  jd: number;
}

export interface SolarDateResult {
  day: number;
  month: number;
  year: number;
  jd: number;
}

/**
 * Chuyển đổi Dương lịch -> Âm lịch Việt Nam (UTC+7)
 */
export function convertSolar2Lunar(
  dd: number,
  mm: number,
  yy: number,
  timeZone: number = 7.0,
): LunarDateResult {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.53058868);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let year = yy;
  if (a11 >= monthStart) {
    year = yy - 1;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = true;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    year -= 1;
  }
  return {
    day: lunarDay,
    month: lunarMonth,
    year: year + 1,
    isLeap: lunarLeap,
    jd: dayNumber,
  };
}

/**
 * Chuyển đổi Âm lịch -> Dương lịch Việt Nam (UTC+7)
 */
export function convertLunar2Solar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  lunarLeap: boolean = false,
  timeZone: number = 7.0,
): SolarDateResult {
  let a11: number;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
  }
  let b11 = getLunarMonth11(lunarYear, timeZone);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }
    if (lunarLeap && lunarMonth !== leapMonth) {
      return { day: 0, month: 0, year: 0, jd: 0 };
    }
    if (lunarLeap || off >= leapOff) {
      off += 1;
    }
  }
  const k = INT(0.5 + (a11 - 2415021.076998695) / 29.53058868);
  const monthStart = getNewMoonDay(k + off, timeZone);
  const jd = monthStart + lunarDay - 1;
  const solarDate = jdToDate(jd);
  return {
    day: solarDate.day,
    month: solarDate.month,
    year: solarDate.year,
    jd,
  };
}

/**
 * Tính Can Chi năm
 */
export function getYearCanChi(lunarYear: number): { canChi: string; stemIndex: number; branchIndex: number } {
  const stemIndex = (lunarYear + 6) % 10;
  const branchIndex = (lunarYear + 8) % 12;
  return {
    canChi: `${VI_STEMS[stemIndex]} ${VI_BRANCHES[branchIndex]}`,
    stemIndex,
    branchIndex,
  };
}

/**
 * Tính Can Chi tháng (Ngũ hổ độn)
 */
export function getMonthCanChi(lunarMonth: number, yearStemIndex: number): string {
  const firstMonthStem = ((yearStemIndex % 5) * 2 + 2) % 10;
  const monthStemIndex = (firstMonthStem + (lunarMonth - 1)) % 10;
  const monthBranchIndex = (2 + (lunarMonth - 1)) % 12;
  return `${VI_STEMS[monthStemIndex]} ${VI_BRANCHES[monthBranchIndex]}`;
}

/**
 * Tính Can Chi ngày từ số ngày Julian
 */
export function getDayCanChi(jd: number): { canChi: string; stemIndex: number; branchIndex: number } {
  const stemIndex = (jd + 9) % 10;
  const branchIndex = (jd + 1) % 12;
  return {
    canChi: `${VI_STEMS[stemIndex]} ${VI_BRANCHES[branchIndex]}`,
    stemIndex,
    branchIndex,
  };
}

/**
 * Tính Can Chi giờ (Ngũ thử độn)
 */
export function getHourCanChi(dayStemIndex: number, timeIndex: number): string {
  const effectiveDayStem = timeIndex === 12 ? (dayStemIndex + 1) % 10 : dayStemIndex;
  const hourBranchIndex = timeIndex === 12 ? 0 : timeIndex % 12;
  const hourStemIndex = ((effectiveDayStem % 5) * 2 + hourBranchIndex) % 10;
  return `${VI_STEMS[hourStemIndex]} ${VI_BRANCHES[hourBranchIndex]}`;
}
