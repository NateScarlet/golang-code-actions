export default async function arrayFromAsync<T>(
  it: AsyncIterable<T>,
  { limit = 0 }: { limit?: number } = {}
): Promise<T[]> {
  const ret = [];
  for await (const i of it) {
    ret.push(i);
    if (limit > 0 && ret.length === limit) {
      break;
    }
  }
  return ret;
}
