import type { VoteResultOption } from "./resultTypes";

export function primaryResultOptionId(options: VoteResultOption[]): number {
  return options.reduce((best, opt) => (opt.ratio > best.ratio ? opt : best)).optionId;
}

export function primaryGroupIndex(groups: Array<{ ratio: number }>): number {
  const max = Math.max(...groups.map((g) => g.ratio));
  return groups.findIndex((g) => g.ratio === max);
}
