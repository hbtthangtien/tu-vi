/**
 * @tu-vi/core — Shared core library
 *
 * Platform-agnostic Zi Wei Dou Shu (紫微斗数) algorithm package.
 * Exports chart generation, Si Hua transformations, pattern detection,
 * Ni Hai Xia knowledge base, and classical text data.
 */

// ── Zi Wei algorithm & Vietnamese Lunar Calendar ─────────
export {
  generateChart,
  getLunarInfo,
} from './ziwei/algorithm';

export {
  convertSolar2Lunar,
  convertLunar2Solar,
  getYearCanChi,
  getMonthCanChi,
  getDayCanChi,
  getHourCanChi,
  jdFromDate,
  jdToDate,
} from './ziwei/vn-lunar';

export {
  getSiHuaByStem,
  buildStarSiHuaMap,
  getYearStemIndex,
  getYearBranchIndex,
  getDaXianSiHua,
  getLiuNianSiHua,
  getLiuYueStemIndex,
  getLiuYueSiHua,
  detectSelfSihua,
  findIncomingPalaces,
  buildAllSelfSihua,
  buildOverlayForStar,
} from './ziwei/sihua';

export { detectPatterns, getMingGongSummary } from './ziwei/patterns';
export {
  getTopicAnalysis,
  TOPIC_PALACE_NAME,
  TOPIC_LABEL,
} from './ziwei/db-analysis';
export type { TopicKey } from './ziwei/db-analysis';

export {
  STEMS,
  VI_STEMS,
  BRANCHES,
  VI_BRANCHES,
  SHICHEN,
  PALACE_NAMES_ORDER,
  SI_HUA_TABLE,
  STAR_BRIGHTNESS,
  STAR_DESCRIPTIONS,
  JU_NAMES,
  ELEMENT_TO_JU,
  NAYIN_ELEMENTS,
  TIANKUI_TABLE,
  LUCUN_TABLE,
  TIANMA_TABLE,
} from './ziwei/constants';

// ── Types ──────────────────────────────────────────────────
export type {
  BirthInfo,
  CalendarType,
  SolarInfo,
  LunarInfo,
  SiHua,
  Star,
  SelfSihuaMark,
  Palace,
  DaXianSiHua,
  DaXian,
  ZiweiChart,
} from './ziwei/types';

export type {
  SelfSihua,
  SiHuaOverlay,
} from './ziwei/sihua';

export type {
  Pattern,
  PatternCondition,
} from './ziwei/patterns';

// ── Ni Hai Xia knowledge ──────────────────────────────────
export * from './nihai/index';

// ── Classical texts ───────────────────────────────────────
export {
  ALL_BOOKS,
  TOTAL_PARAGRAPHS,
  getBookBySlug,
  getChapter,
  getParagraphById,
  searchClassics,
} from './classics/index';

export type {
  Book,
  Chapter,
  Paragraph,
  SearchHit,
} from './classics/types';
