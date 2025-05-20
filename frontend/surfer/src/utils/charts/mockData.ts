export default function generateMockMetricsData(labels: Date[]) {
  const success = labels.map((time) => ({
    x: time,
    y: 100 + Math.floor(Math.random() * 50), // 100 ~ 149
  }));

  const failure = labels.map((time) => ({
    x: time,
    y: Math.floor(Math.random() * 10), // 0 ~ 9
  }));

  const responseTime = labels.map((time) => ({
    x: time,
    y: 100 + Math.random() * 50, // ms
  }));

  const errorRate = labels.map((time, i) => {
    const s = success[i].y;
    const f = failure[i].y;
    const total = s + f;
    return {
      x: time,
      y: total === 0 ? 0 : f / total,
    };
  });

  return { success, failure, responseTime, errorRate };
}

// useEffect(() => {
//   if (labels.length > 0 && !metrics.isRunning) {
//     const { success, failure, responseTime, errorRate } =
//       generateMockMetricsData(labels);

//     setSuccess(success);
//     setFailure(failure);
//     setResponseTime(responseTime);
//     setErrorRate(errorRate);
//   }
// }, [labels, metrics.isRunning]);
