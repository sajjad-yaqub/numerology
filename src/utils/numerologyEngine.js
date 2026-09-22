/**
 * ASTRANUMERICS - NUMEROLOGY ENGINE
 * Clean, high-precision deterministic calculation library supporting both
 * Pythagorean and Chaldean numerology systems.
 */

import { COMBINATORIAL_RULES } from '../data/numerologyData.js';

// Pythagorean Letter Value Map (A=1 ... Z=8)
export const PYTHAGOREAN_MAP = {
  a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9,
  j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9,
  s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8
};

// Chaldean Letter Value Map (Ancient Babylonian 1-8 System)
export const CHALDEAN_MAP = {
  a:1, b:2, c:3, d:4, e:5, f:8, g:3, h:5, i:1,
  j:1, k:2, l:3, m:4, n:5, o:7, p:8, q:1, r:2,
  s:3, t:4, u:6, v:6, w:6, x:5, y:1, z:7
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

/**
 * Reduce a number to a single digit or Master Number (11, 22, 33).
 */
export function reduceNumber(num, keepMaster = true) {
  if (num === 0) return 0;
  let current = Math.abs(num);
  let compoundPath = [current];

  while (current > 9) {
    if (keepMaster && (current === 11 || current === 22 || current === 33)) {
      break;
    }
    const digits = String(current).split('').map(Number);
    current = digits.reduce((sum, d) => sum + d, 0);
    compoundPath.push(current);
  }

  return {
    reduced: current,
    compoundPath,
    isMaster: current === 11 || current === 22 || current === 33,
    karmicDebt: checkKarmicDebt(compoundPath)
  };
}

/**
 * Check if compound summation path contains Karmic Debt numbers (13, 14, 16, 19).
 */
function checkKarmicDebt(compoundPath) {
  for (const num of compoundPath) {
    if (num === 13) return { debt: 13, reduced: 4, name: "Karmic Debt 13/4 (Discipline & Laziness)" };
    if (num === 14) return { debt: 14, reduced: 5, name: "Karmic Debt 14/5 (Freedom & Temperance)" };
    if (num === 16) return { debt: 16, reduced: 7, name: "Karmic Debt 16/7 (Rebirth & Ego Dissolution)" };
    if (num === 19) return { debt: 19, reduced: 1, name: "Karmic Debt 19/1 (Independence & Self-Reliance)" };
  }
  return null;
}

/**
 * Check if character Y acts as vowel in given word context.
 */
function isVowelChar(char, word, idx) {
  const lower = char.toLowerCase();
  if (VOWELS.has(lower)) return true;
  if (lower === 'y') {
    // Y is vowel if not at start of word and preceded by consonant
    if (idx > 0) {
      const prevChar = word[idx - 1].toLowerCase();
      if (!VOWELS.has(prevChar)) return true;
    }
  }
  return false;
}

/**
 * Calculate Life Path Number from DOB (YYYY-MM-DD format).
 */
export function calculateLifePath(dobString) {
  if (!dobString || !dobString.includes('-')) return { reduced: 0, compoundPath: [] };
  const [yearStr, monthStr, dayStr] = dobString.split('-');

  const monthSum = reduceNumber(parseInt(monthStr, 10)).reduced;
  const daySum = reduceNumber(parseInt(dayStr, 10)).reduced;
  const yearSum = reduceNumber(parseInt(yearStr, 10)).reduced;

  const totalSum = monthSum + daySum + yearSum;
  return reduceNumber(totalSum);
}

/**
 * Calculate Expression / Destiny, Soul Urge, and Personality Numbers from Name.
 */
export function calculateNameNumbers(fullName, system = 'pythagorean') {
  const letterMap = system === 'chaldean' ? CHALDEAN_MAP : PYTHAGOREAN_MAP;
  const cleanName = fullName.toLowerCase().replace(/[^a-z]/g, '');

  let expressionSum = 0;
  let soulUrgeSum = 0;
  let personalitySum = 0;

  const letterDetails = [];

  const words = fullName.trim().split(/\s+/);
  let globalIdx = 0;

  for (const word of words) {
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase();
      if (letterMap[char]) {
        const val = letterMap[char];
        const isVowel = isVowelChar(char, word, i);
        expressionSum += val;

        if (isVowel) {
          soulUrgeSum += val;
        } else {
          personalitySum += val;
        }

        letterDetails.push({
          char: word[i],
          val,
          isVowel,
          idx: globalIdx++
        });
      }
    }
  }

  return {
    expression: reduceNumber(expressionSum),
    soulUrge: reduceNumber(soulUrgeSum),
    personality: reduceNumber(personalitySum),
    letterDetails
  };
}

/**
 * Calculate Attitude / Sun Number (Day + Month).
 */
export function calculateAttitudeNumber(dobString) {
  if (!dobString || !dobString.includes('-')) return reduceNumber(0);
  const [, monthStr, dayStr] = dobString.split('-');
  const sum = parseInt(monthStr, 10) + parseInt(dayStr, 10);
  return reduceNumber(sum);
}

/**
 * Calculate Maturity / Power Number (Life Path + Expression).
 */
export function calculateMaturityNumber(lifePathNum, expressionNum) {
  return reduceNumber(lifePathNum + expressionNum);
}

/**
 * Calculate Personal Year, Month, and Day for a specific target date.
 */
export function calculatePersonalCycles(dobString, targetDate = new Date()) {
  if (!dobString || !dobString.includes('-')) return { year: 0, month: 0, day: 0 };
  const [, monthStr, dayStr] = dobString.split('-');

  const birthMonth = parseInt(monthStr, 10);
  const birthDay = parseInt(dayStr, 10);

  const currentYear = targetDate.getFullYear();
  const currentMonth = targetDate.getMonth() + 1;
  const currentDay = targetDate.getDate();

  // Personal Year = Birth Month + Birth Day + Current Universal Year
  const yearSum = birthMonth + birthDay + currentYear;
  const personalYear = reduceNumber(yearSum).reduced;

  // Personal Month = Personal Year + Current Calendar Month
  const personalMonth = reduceNumber(personalYear + currentMonth).reduced;

  // Personal Day = Personal Month + Current Calendar Day
  const personalDay = reduceNumber(personalMonth + currentDay).reduced;

  return {
    personalYear,
    personalMonth,
    personalDay
  };
}

/**
 * Calculate 3x3 Lo Shu Square & Planes of Strength/Weakness.
 */
export function calculateLoShuGrid(dobString) {
  const counts = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 };
  if (!dobString) return { counts, arrows: [], planes: {} };

  const digits = dobString.replace(/-/g, '').split('');
  for (const d of digits) {
    if (d !== '0' && counts[d] !== undefined) {
      counts[d]++;
    }
  }

  // Define Arrows of Strength & Weakness
  const arrowDefinitions = [
    { name: "Arrow of Determination", numbers: [1, 2, 3], type: "strength" },
    { name: "Arrow of Willpower", numbers: [4, 5, 6], type: "strength" },
    { name: "Arrow of Activity", numbers: [7, 8, 9], type: "strength" },
    { name: "Arrow of Compassion", numbers: [3, 5, 7], type: "strength" },
    { name: "Arrow of Verbal Expression", numbers: [1, 5, 9], type: "strength" },
    { name: "Arrow of Intellect", numbers: [3, 6, 9], type: "strength" },
    { name: "Arrow of Emotional Balance", numbers: [2, 5, 8], type: "strength" },
    { name: "Arrow of Practical Memory", numbers: [4, 3, 8], type: "strength" },
    
    { name: "Arrow of Hesitation (Missing 1-2-3)", numbers: [1, 2, 3], type: "weakness" },
    { name: "Arrow of Frustration (Missing 4-5-6)", numbers: [4, 5, 6], type: "weakness" },
    { name: "Arrow of Passivity (Missing 7-8-9)", numbers: [7, 8, 9], type: "weakness" },
    { name: "Arrow of Skepticism (Missing 3-5-7)", numbers: [3, 5, 7], type: "weakness" }
  ];

  const arrows = [];
  for (const def of arrowDefinitions) {
    const hasAll = def.numbers.every(n => counts[n] > 0);
    const hasNone = def.numbers.every(n => counts[n] === 0);

    if (def.type === "strength" && hasAll) {
      arrows.push({ name: def.name, numbers: def.numbers, type: "strength" });
    } else if (def.type === "weakness" && hasNone) {
      arrows.push({ name: def.name, numbers: def.numbers, type: "weakness" });
    }
  }

  const planes = {
    mental: { name: "Thought / Mental Plane (4, 9, 2)", score: counts[4] + counts[9] + counts[2] },
    emotional: { name: "Will / Emotional Plane (3, 5, 7)", score: counts[3] + counts[5] + counts[7] },
    physical: { name: "Action / Physical Plane (8, 1, 6)", score: counts[8] + counts[1] + counts[6] }
  };

  return { counts, arrows, planes };
}

/**
 * Calculate Synastry / Compatibility index between 2 profiles.
 */
export function calculateSynastry(profileA, profileB, system = 'pythagorean') {
  const lpA = calculateLifePath(profileA.dob).reduced;
  const lpB = calculateLifePath(profileB.dob).reduced;

  const nameA = calculateNameNumbers(profileA.name, system);
  const nameB = calculateNameNumbers(profileB.name, system);

  // Matrix of compatibility harmony
  const diffLP = Math.abs(lpA - lpB);
  let baseScore = 70;

  if (lpA === lpB) baseScore += 25; // Perfect Life Path alignment
  else if (diffLP === 2 || diffLP === 4 || diffLP === 6) baseScore += 15;
  else if (diffLP === 1 || diffLP === 3 || diffLP === 5) baseScore += 8;

  if (nameA.soulUrge.reduced === nameB.soulUrge.reduced) baseScore += 10;
  if (nameA.expression.reduced === nameB.expression.reduced) baseScore += 8;

  const score = Math.min(99, Math.max(45, baseScore));

  let status = "Harmonious Spark";
  if (score >= 90) status = "Twin Flame Synastry";
  else if (score >= 80) status = "Cosmic Soulmates";
  else if (score >= 70) status = "Empowering Alliance";
  else if (score >= 60) status = "Karmic Growth Catalyst";

  return {
    score,
    status,
    profileA: { lp: lpA, soul: nameA.soulUrge.reduced, exp: nameA.expression.reduced },
    profileB: { lp: lpB, soul: nameB.soulUrge.reduced, exp: nameB.expression.reduced }
  };
}

/**
 * Calculate Address, Phone Number, or Vehicle License Plate Numerology.
 */
export function calculateAddressNumerology(inputStr, system = 'pythagorean') {
  const letterMap = system === 'chaldean' ? CHALDEAN_MAP : PYTHAGOREAN_MAP;
  let sum = 0;
  const chars = inputStr.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const c of chars) {
    if (/[0-9]/.test(c)) {
      sum += parseInt(c, 10);
    } else if (letterMap[c]) {
      sum += letterMap[c];
    }
  }

  return reduceNumber(sum);
}

/**
 * Compose a multi-layered Combinatorial Algorithmic Synthesis.
 * Blends Life Path, Expression, Soul Urge, Personality, Karmic Debts, and Elemental Resonances.
 */
export function composeCombinatorialSynthesis(dobString, fullName, system = 'pythagorean') {
  if (!dobString || !fullName) return null;

  const lifePath = calculateLifePath(dobString);
  const nameNums = calculateNameNumbers(fullName, system);
  const loShu = calculateLoShuGrid(dobString);

  const lpNum = lifePath.reduced;
  const expNum = nameNums.expression.reduced;
  const soulNum = nameNums.soulUrge.reduced;
  const persNum = nameNums.personality.reduced;

  // 1. Evaluate Synergy Type (Unified, Complementary, or Catalyst)
  let synergy = COMBINATORIAL_RULES.SYNERGY_TYPES.CATALYST;
  if (lpNum === expNum) {
    synergy = COMBINATORIAL_RULES.SYNERGY_TYPES.UNIFIED;
  } else if (Math.abs(lpNum - expNum) % 2 === 0 || lpNum === 11 || expNum === 11 || lpNum === 22 || expNum === 22) {
    synergy = COMBINATORIAL_RULES.SYNERGY_TYPES.COMPLEMENTARY;
  }

  // 2. Elemental Pairing
  const lpElem = COMBINATORIAL_RULES.ELEMENT_MAP[lpNum] || "Ether";
  const expElem = COMBINATORIAL_RULES.ELEMENT_MAP[expNum] || "Ether";
  const pairKey = `${lpElem}-${expElem}`;
  const reversePairKey = `${expElem}-${lpElem}`;
  const elementalSummary = COMBINATORIAL_RULES.ELEMENTAL_SYNERGY[pairKey] ||
    COMBINATORIAL_RULES.ELEMENTAL_SYNERGY[reversePairKey] ||
    `${lpElem} meets ${expElem} in cosmic equilibrium.`;

  // 3. Soul Urge vs. Personality
  const isAligned = (soulNum === persNum) || Math.abs(soulNum - persNum) === 2;
  const innerOuterText = isAligned ? COMBINATORIAL_RULES.INNER_OUTER_DYNAMICS.ALIGNED : COMBINATORIAL_RULES.INNER_OUTER_DYNAMICS.CONTRASTING;

  // 4. Karmic Debt Collection
  const karmicDebts = [];
  if (lifePath.karmicDebt) karmicDebts.push(lifePath.karmicDebt);
  if (nameNums.expression.karmicDebt) karmicDebts.push(nameNums.expression.karmicDebt);
  if (nameNums.soulUrge.karmicDebt) karmicDebts.push(nameNums.soulUrge.karmicDebt);

  // 5. Lo Shu Grid Active Strength/Weakness
  const activeArrows = loShu.arrows.map(a => a.name).join(", ");

  return {
    lpNum,
    expNum,
    soulNum,
    persNum,
    synergyTag: synergy.tag,
    synergyDesc: synergy.desc,
    lpElem,
    expElem,
    elementalSummary,
    innerOuterText,
    karmicDebts,
    activeArrows: activeArrows || "Balanced Grid (No Complete Arrows)",
    isMasterVoltage: lifePath.isMaster || nameNums.expression.isMaster
  };
}

