function sum(value: string): number;
function sum(value: number): typeof sum;
function sum(value: any): number | typeof sum {
  if (typeof value === "string") {
    return parseInt(value);
  }

  const prev = value;

  return (value) => {
    if (typeof value === "string") {
      return parseInt(value) + prev;
    }

    return sum(prev + value);
  };
}
