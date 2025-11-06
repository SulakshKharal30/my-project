module.exports = async function retryWithBackoff(fn, opts = {}) {
  const maxAttempts = opts.maxAttempts || 5;
  const base = opts.base || 300; // milliseconds
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const backoff = base * Math.pow(2, attempt - 1);
      await new Promise(r => setTimeout(r, backoff));
    }
  }
};
