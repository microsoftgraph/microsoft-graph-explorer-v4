export async function exponentialFetchRetry<T>( fn: () => Promise<T>, retriesLeft: number,
  interval: number, condition?: (result: T, retriesLeft?: number) => Promise<boolean>
): Promise<T> {
  try {
    const result = await fn();
    if (condition) {
      const isConditionSatisfied = await condition(result, retriesLeft);
      if(isConditionSatisfied){
        throw new Error('An error occurred during the execution of the request');
      }
    }
    if (result && result instanceof Response && result.status && result.status >= 500){
      throw new Error('Encountered a server error during execution of the request');
    }
    return result;
  } catch (error: unknown) {
    if (retriesLeft === 1) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
    return exponentialFetchRetry(fn, retriesLeft - 1, interval * 2, condition);
  }
}
