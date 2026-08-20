export type CalendarType = 'solar' | 'lunar';

export interface SolarInfo {
  solarYear: number;
  solarMonth: number;
  solarDay: number;
}

export interface BirthInfo {
  year: number;      // Năm sinh (Dương lịch hoặc Âm lịch tuỳ calendarType)
  month: number;     // Tháng sinh (1-12)
  day: number;       // Ngày sinh (1-31)
  hour: number;      // 时辰/Giờ sinh (0=Tý sớm, 1=Sửu, ..., 11=Hợi, 12=Dạ Tý)
  gender: 'male' | 'female';
  calendarType?: CalendarType;  // 'solar' (Dương lịch - mặc định) | 'lunar' (Âm lịch)
  isLeapMonth?: boolean;        // Khi calendarType === 'lunar', đánh dấu tháng nhuận
  isPre1975SouthVN?: boolean;   // Sinh tại Miền Nam (1960-1975) dùng GMT+8 (hiệu chỉnh -1h)
  minute?: number;              // Phút sinh cụ thể (0-59, tuỳ chọn)
  name?: string;
  province?: string;   // Tỉnh/Thành phố sinh (dùng tính chân thái dương thời)
  city?: string;
  longitude?: number;  // Kinh độ (dùng tính chân thái dương thời)
}

export interface LunarInfo {
  lunarYear: number;
  lunarMonth: number;    // positive = normal, negative = leap month
  lunarDay: number;
  yearStem: number;      // 0-9 (甲乙丙丁戊己庚辛壬癸 / Giáp..Quý)
  yearBranch: number;    // 0-11 (子丑寅卯辰巳午未申酉戌亥 / Tý..Hợi)
  yearCanChi: string;    // e.g. 'Giáp Thìn' / '甲辰'
  monthCanChi?: string;  // e.g. 'Bính Dần'
  dayCanChi?: string;    // e.g. 'Ất Tỵ'
  hourCanChi?: string;   // e.g. 'Bính Tý'
  isLeapMonth: boolean;
  solarInfo?: SolarInfo; // Ngày Dương lịch tương ứng (nếu nhập Âm lịch) hoặc gốc
}

export type SiHua = '禄' | '权' | '科' | '忌';

export interface Star {
  name: string;
  type: 'major' | 'minor' | 'lucky' | 'sha';
  siHua?: SiHua;
  brightness?: 'bright' | 'normal' | 'dim';  // 庙旺利陷
}

export interface SelfSihuaMark {
  siHua: SiHua;       // 禄/权/科/忌
  starName: string;   // 自化的星
}

export interface Palace {
  branch: number;      // 0-11 (地支索引)
  stem: number;        // 0-9 (天干索引)
  name: string;        // 宫名
  stars: Star[];
  daXianAge?: [number, number];   // 大限年龄段
  isCurrentDaXian?: boolean;
  isMingGong?: boolean;
  isShenGong?: boolean;
  /** 宫干自化（倪师体系核心） */
  selfSihua?: SelfSihuaMark[];
  /** 对宫地支索引（永远 = (branch + 6) % 12） */
  oppositeBranch?: number;
  /** 是否空宫（无主星） */
  isEmpty?: boolean;
  /** 若为空宫，借自哪个宫的地支索引 = oppositeBranch */
  borrowedFromBranch?: number;
  /** 若为空宫，借自哪个宫名 */
  borrowedFromName?: string;
  /** 若为空宫，借到的对宫主星名列表（结构化数据，文案层不再需要从文本反查） */
  borrowedStars?: string[];
}

export interface DaXianSiHua {
  stemIndex: number;
  stemName: string;
  lu: string;    // 化禄星名
  quan: string;  // 化权星名
  ke: string;    // 化科星名
  ji: string;    // 化忌星名
}

export interface DaXian {
  startAge: number;
  endAge: number;
  palaceBranch: number;
  palaceName: string;
  stemIndex?: number;    // 大限宫的天干索引（用于大限四化）
  stemName?: string;
  siHua?: DaXianSiHua;   // 该大限四化（基于宫干）
}

export interface ZiweiChart {
  birthInfo: BirthInfo;
  lunarInfo: LunarInfo;
  mingGongBranch: number;    // 命宫地支
  shenGongBranch: number;    // 身宫地支
  wuxingJu: number;          // 五行局 (2,3,4,5,6)
  wuxingJuName: string;      // e.g. '水二局'
  ziweiPos: number;          // 紫微星位置
  palaces: Palace[];         // 12宫，按地支0-11排序
  daXians: DaXian[];
  currentAge: number;
  currentDaXianIndex: number;
}
