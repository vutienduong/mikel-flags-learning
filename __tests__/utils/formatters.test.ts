import { formatPopulation, formatArea } from "../../utils/formatters";

describe("formatPopulation", () => {
  it("formats billions", () => {
    expect(formatPopulation(1_400_000_000)).toBe("1.4B");
  });
  it("formats millions", () => {
    expect(formatPopulation(97_000_000)).toBe("97M");
  });
  it("formats thousands", () => {
    expect(formatPopulation(500_000)).toBe("500K");
  });
  it("formats small numbers as-is", () => {
    expect(formatPopulation(800)).toBe("800");
  });
});

describe("formatArea", () => {
  it("formats millions of km²", () => {
    expect(formatArea(17_098_242)).toBe("17.1M km²");
  });
  it("formats thousands of km²", () => {
    expect(formatArea(331_212)).toBe("331K km²");
  });
  it("formats small areas", () => {
    expect(formatArea(2)).toBe("2 km²");
  });
});
