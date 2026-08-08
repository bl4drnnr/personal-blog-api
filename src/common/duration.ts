/** Parse durations like '15m', '12h', '7d' into milliseconds. Throws on anything else. */
export function durationToMs(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) {
    throw new Error(`Invalid duration: '${value}' (expected e.g. '30s', '15m', '12h', '7d')`);
  }
  const amount = Number(match[1]);
  const unit = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 }[
    match[2] as 's' | 'm' | 'h' | 'd'
  ];
  return amount * unit;
}
