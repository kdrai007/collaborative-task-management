// =============================================================================
// lib/lexorank.ts — LexoRank ordering utility
//
// LexoRank uses variable-length strings to represent sort positions.
// Items can be inserted between any two existing items by computing a
// midpoint string — avoiding the need to renumber the whole list.
//
// Alphabet: lowercase ASCII a–z (26 chars, simple and URL-safe).
// =============================================================================

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const MIN_CHAR  = ALPHABET[0]!;                               // 'a'
const MAX_CHAR  = ALPHABET[ALPHABET.length - 1]!;            // 'z'
const MID_CHAR  = ALPHABET[Math.floor(ALPHABET.length / 2)]!; // 'n'

/** The rank to assign the very first item in an empty list. */
export const INITIAL_RANK = MID_CHAR; // 'n'

/**
 * Compute the midpoint rank between `before` and `after`.
 *
 * Pass null for `before`  → insert before the first item.
 * Pass null for `after`   → insert after the last item.
 * Pass null for both      → returns the initial rank for an empty list.
 *
 * @example
 *   midRank(null, 'n')  → 'g'
 *   midRank('n', null)  → 'nn'
 *   midRank('g', 'n')   → 'k' (or similar midpoint)
 */
export function midRank(before: string | null, after: string | null): string {
  if (!before && !after) return INITIAL_RANK;
  if (!before)  return _rankBefore(after!);
  if (!after)   return _rankAfter(before);
  return _rankBetween(before, after);
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/** Produce a rank that sorts before `rank`. */
function _rankBefore(rank: string): string {
  const code = rank.charCodeAt(0);
  const minCode = MIN_CHAR.charCodeAt(0);

  if (code > minCode) {
    // There is room below the first character — go one step lower and pad.
    return String.fromCharCode(code - 1) + MID_CHAR;
  }
  // Already at the minimum first character — prepend MIN_CHAR to go deeper.
  return MIN_CHAR + rank;
}

/** Produce a rank that sorts after `rank`. */
function _rankAfter(rank: string): string {
  // Appending MID_CHAR always produces a string that is lexicographically
  // greater than `rank` when `rank` ends in or before MID_CHAR.
  return rank + MID_CHAR;
}

/** Produce a rank lexicographically between `before` and `after`. */
function _rankBetween(before: string, after: string): string {
  const maxLen = Math.max(before.length, after.length);

  // Pad both strings to the same length for character-by-character comparison.
  const b = before.padEnd(maxLen, MIN_CHAR);
  const a = after.padEnd(maxLen, MAX_CHAR);

  for (let i = 0; i < maxLen; i++) {
    const bCode = ALPHABET.indexOf(b[i]!);
    const aCode = ALPHABET.indexOf(a[i]!);

    if (aCode - bCode > 1) {
      // Gap is large enough — insert the midpoint character at this position.
      const midCode = Math.floor((bCode + aCode) / 2);
      return b.slice(0, i) + ALPHABET[midCode];
    }

    if (aCode > bCode) {
      // Gap is exactly 1 — recurse one level deeper by appending MID_CHAR.
      return b.slice(0, i + 1) + MID_CHAR;
    }
  }

  // No gap found in existing length — extend beyond `before`.
  return before + MID_CHAR;
}
