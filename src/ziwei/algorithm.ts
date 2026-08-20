/**
 * 紫微斗数排盘算法 — 基于 iztro 开源库 & Lịch Âm Việt Nam (UTC+7)
 * Hỗ trợ chuyển đổi Lịch Âm / Dương chuẩn Việt Nam và 13 mốc giờ sinh.
 */

import { astro } from 'iztro';
import {
  convertSolar2Lunar,
  convertLunar2Solar,
  getYearCanChi,
  getMonthCanChi,
  getDayCanChi,
  getHourCanChi,
} from './vn-lunar';
import type { BirthInfo, LunarInfo, Star, Palace, DaXian, ZiweiChart, CalendarType } from './types';
import { BRANCHES, STEMS } from './constants';

// ─── 农历信息（Chuyển đổi Lịch Âm - Dương chuẩn Việt Nam UTC+7）────────────────
export function getLunarInfo(
  year: number,
  month: number,
  day: number,
  calendarType: CalendarType = 'solar',
  isLeapMonth: boolean = false,
  hour: number = 0,
): LunarInfo {
  let lunarDay: number;
  let lunarMonth: number;
  let lunarYear: number;
  let isLeap: boolean;
  let solarDay: number;
  let solarMonth: number;
  let solarYear: number;
  let jd: number;

  if (calendarType === 'lunar') {
    lunarDay = day;
    lunarMonth = month;
    lunarYear = year;
    isLeap = !!isLeapMonth;
    const solarRes = convertLunar2Solar(lunarDay, lunarMonth, lunarYear, isLeap);
    solarDay = solarRes.day;
    solarMonth = solarRes.month;
    solarYear = solarRes.year;
    jd = solarRes.jd;
  } else {
    solarDay = day;
    solarMonth = month;
    solarYear = year;
    const lunarRes = convertSolar2Lunar(solarDay, solarMonth, solarYear);
    lunarDay = lunarRes.day;
    lunarMonth = lunarRes.month;
    lunarYear = lunarRes.year;
    isLeap = lunarRes.isLeap;
    jd = lunarRes.jd;
  }

  const yearRes = getYearCanChi(lunarYear);
  const monthCanChi = getMonthCanChi(lunarMonth, yearRes.stemIndex);
  const dayRes = getDayCanChi(jd);
  const hourCanChi = getHourCanChi(dayRes.stemIndex, hour);

  return {
    lunarYear,
    lunarMonth,
    lunarDay,
    yearStem: yearRes.stemIndex,
    yearBranch: yearRes.branchIndex,
    yearCanChi: yearRes.canChi,
    monthCanChi,
    dayCanChi: dayRes.canChi,
    hourCanChi,
    isLeapMonth: isLeap,
    solarInfo: {
      solarYear,
      solarMonth,
      solarDay,
    },
  };
}

// ─── 亮度映射 ────────────────────────────────────────────────────
function mapBrightness(b?: string): 'bright' | 'normal' | 'dim' {
  if (!b) return 'normal';
  if (b === '庙' || b === '旺') return 'bright';
  if (b === '陷' || b === '不') return 'dim';
  return 'normal';
}

// ─── 星曜类型映射 ────────────────────────────────────────────────
const SHA_STARS = new Set(['擎羊', '陀罗', '火星', '铃星', '地空', '地劫',
  '天空', '旬空', '截路', '大耗', '天使', '天伤']);
const LUCKY_STARS = new Set(['文昌', '文曲', '左辅', '右弼', '天魁', '天钺',
  '禄存', '天马', '天官', '天福', '天才', '天寿', '三台', '八座', '恩光',
  '天贵', '台辅', '龙池', '凤阁', '红鸾', '天喜', '孤辰', '寡宿']);

function mapStarType(starName: string, iztroType: string): Star['type'] {
  if (SHA_STARS.has(starName)) return 'sha';
  if (LUCKY_STARS.has(starName)) return 'lucky';
  const t = (iztroType ?? '').toLowerCase();
  if (t === '主星' || t === 'major') return 'major';
  if (t === '煞星' || t === 'tough') return 'sha';
  if (t === '吉星' || t === 'soft' || t === '禄存' || t === '天马') return 'lucky';
  return 'minor';
}

// ─── 五行局名称 → 数字 ──────────────────────────────────────────
function parseWuxingJu(name: string): number {
  if (name.includes('二')) return 2;
  if (name.includes('三')) return 3;
  if (name.includes('四')) return 4;
  if (name.includes('五')) return 5;
  if (name.includes('六')) return 6;
  return 3;
}

// ─── 主函数：生成命盘 ────────────────────────────────────────────
export function generateChart(birthInfo: BirthInfo): ZiweiChart {
  let { year, month, day, hour, gender, calendarType, isLeapMonth, isPre1975SouthVN } = birthInfo;
  calendarType = calendarType ?? 'solar';
  isLeapMonth = isLeapMonth ?? false;

  // Hiệu chỉnh giờ sinh nếu sinh tại Miền Nam giai đoạn 1960-1975 (GMT+8 -> GMT+7: lùi 1 giờ)
  let adjustedHour = hour;
  if (isPre1975SouthVN && year >= 1960 && year <= 1975) {
    adjustedHour = adjustedHour === 0 ? 11 : adjustedHour === 12 ? 11 : adjustedHour - 1;
  }

  // 1. Tính thông tin Âm - Dương chuẩn Việt Nam
  const lunarInfo = getLunarInfo(year, month, day, calendarType, isLeapMonth, adjustedHour);

  // 2. An sao qua iztro byLunar (sử dụng ngày Âm lịch đã tính chuẩn thiên văn)
  const iztroGender = gender === 'male' ? '男' : '女';
  const lunarDateStr = `${lunarInfo.lunarYear}-${lunarInfo.lunarMonth}-${lunarInfo.lunarDay}`;
  const astrolabe = astro.byLunar(lunarDateStr, adjustedHour, iztroGender, lunarInfo.isLeapMonth, true, 'zh-CN');

  // 3. 组装十二宫
  const palaces: Palace[] = astrolabe.palaces.map(p => {
    const branch = BRANCHES.indexOf(p.earthlyBranch as string);
    const stem   = STEMS.indexOf(p.heavenlyStem as string);

    // 合并所有星：主星 + 次星 + 杂耀
    const allStars: Star[] = [
      ...(p.majorStars ?? []).map(s => ({
        name:       s.name as string,
        type:       'major' as const,
        brightness: mapBrightness(s.brightness as string),
        siHua:      s.mutagen as Star['siHua'],
      })),
      ...(p.minorStars ?? []).map(s => ({
        name:  s.name as string,
        type:  mapStarType(s.name as string, s.type as string),
        siHua: s.mutagen as Star['siHua'],
      })),
      ...(p.adjectiveStars ?? []).map(s => ({
        name:  s.name as string,
        type:  'minor' as const,
        siHua: s.mutagen as Star['siHua'],
      })),
    ];

    const range = p.decadal?.range;
    return {
      branch:        branch >= 0 ? branch : 0,
      stem:          stem >= 0 ? stem : 0,
      name:          p.name as string,
      stars:         allStars,
      daXianAge:     range ? [range[0], range[1]] as [number, number] : undefined,
      isMingGong:    p.name === '命宫',
      isShenGong:    p.isBodyPalace ?? false,
      isCurrentDaXian: false,
    };
  });

  // 4. Tuổi hiện tại & Đại hạn
  const currentYear = new Date().getFullYear();
  const currentAge  = currentYear - (lunarInfo.solarInfo?.solarYear ?? year);

  palaces.forEach(p => {
    if (p.daXianAge && currentAge >= p.daXianAge[0] && currentAge <= p.daXianAge[1]) {
      p.isCurrentDaXian = true;
    }
  });

  // 5. Cung đối xung & Mượn sao
  palaces.forEach(p => {
    p.oppositeBranch = (p.branch + 6) % 12;
    const mainStars = p.stars.filter(s => s.type === 'major');
    p.isEmpty = mainStars.length === 0;
    if (p.isEmpty) {
      const oppPalace = palaces.find(q => q.branch === p.oppositeBranch);
      if (oppPalace) {
        p.borrowedFromBranch = oppPalace.branch;
        p.borrowedFromName = oppPalace.name;
        p.borrowedStars = oppPalace.stars.filter(s => s.type === 'major').map(s => s.name);
      }
    }
  });

  // 6. Cung Mệnh, Thân, Cục
  const mingGongBranch = BRANCHES.indexOf(astrolabe.earthlyBranchOfSoulPalace as string);
  const shenGongBranch = BRANCHES.indexOf(astrolabe.earthlyBranchOfBodyPalace as string);
  const wuxingJuName   = astrolabe.fiveElementsClass as string;
  const wuxingJu       = parseWuxingJu(wuxingJuName);

  // 7. Vị trí Tử Vi
  const ziweiPalace = palaces.find(p => p.stars.some(s => s.name === '紫微' && s.type === 'major'));
  const ziweiPos    = ziweiPalace?.branch ?? 0;

  // 8. Mảng Đại hạn
  const daXians: DaXian[] = palaces
    .filter(p => p.daXianAge)
    .sort((a, b) => a.daXianAge![0] - b.daXianAge![0])
    .map(p => ({
      startAge:    p.daXianAge![0],
      endAge:      p.daXianAge![1],
      palaceBranch: p.branch,
      palaceName:   p.name,
    }));

  const currentDaXianIndex = daXians.findIndex(
    dx => currentAge >= dx.startAge && currentAge <= dx.endAge,
  );

  return {
    birthInfo: {
      ...birthInfo,
      hour: adjustedHour,
    },
    lunarInfo,
    mingGongBranch: mingGongBranch >= 0 ? mingGongBranch : 0,
    shenGongBranch: shenGongBranch >= 0 ? shenGongBranch : 0,
    wuxingJu,
    wuxingJuName,
    ziweiPos,
    palaces,
    daXians,
    currentAge,
    currentDaXianIndex,
  };
}
