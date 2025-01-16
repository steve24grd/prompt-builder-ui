const reportWebVitals = async (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    const webVitals = await import('web-vitals');
    webVitals.onCLS(onPerfEntry);
    webVitals.onFID(onPerfEntry);
    webVitals.onFCP(onPerfEntry);
    webVitals.onLCP(onPerfEntry);
    webVitals.onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
