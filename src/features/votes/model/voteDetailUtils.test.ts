import { describe, expect, it } from "vitest";
import type { VoteResultOption } from "./resultTypes";
import { primaryGroupIndex, primaryResultOptionId } from "./voteDetailUtils";

describe("primaryResultOptionId", () => {
  it("ratio가 가장 높은 옵션의 optionId를 반환한다", () => {
    const options: VoteResultOption[] = [
      { optionId: 1, label: "A", voteCount: 10, ratio: 30 },
      { optionId: 2, label: "B", voteCount: 25, ratio: 70 },
      { optionId: 3, label: "C", voteCount: 5, ratio: 0 },
    ];
    expect(primaryResultOptionId(options)).toBe(2);
  });

  it("ratio가 동률인 경우 reduce 특성상 앞에 있는 옵션의 optionId를 유지한다", () => {
    const options: VoteResultOption[] = [
      { optionId: 10, label: "A", voteCount: 15, ratio: 50 },
      { optionId: 20, label: "B", voteCount: 15, ratio: 50 },
    ];
    expect(primaryResultOptionId(options)).toBe(10);
  });
});

describe("primaryGroupIndex", () => {
  it("ratio가 가장 높은 그룹의 인덱스를 반환한다", () => {
    const groups = [{ ratio: 20 }, { ratio: 55 }, { ratio: 25 }];
    expect(primaryGroupIndex(groups)).toBe(1);
  });

  it("ratio가 동률인 경우 첫 번째로 나타나는 인덱스를 반환한다", () => {
    const groups = [{ ratio: 40 }, { ratio: 40 }, { ratio: 20 }];
    expect(primaryGroupIndex(groups)).toBe(0);
  });
});
