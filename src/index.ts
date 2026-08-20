/**
 * @tu-vi/core — Shared core library
 *
 * Platform-agnostic Zi Wei Dou Shu (紫微斗数) algorithm package.
 * Exports chart generation, Si Hua transformations, pattern detection,
 * Ni Hai Xia knowledge base, and classical text data.
 */

// ── Zi Wei algorithm ──────────────────────────────────────
export {
  generateChart,
  getLunarInfo,
} from './ziwei/algorithm';

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
  STEMS,
  BRANCHES,
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
