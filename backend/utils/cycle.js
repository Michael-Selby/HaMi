const calculateCycle = (lastPeriodDate, cycleLength, periodLength) => {
  const lastPeriod = new Date(lastPeriodDate);
  const predictions = [];

  for (let i = 0; i < 6; i++) {
    const cycleStart = new Date(lastPeriod);
    cycleStart.setDate(cycleStart.getDate() + (i * cycleLength));

    const cycleEnd = new Date(cycleStart);
    cycleEnd.setDate(cycleEnd.getDate() + cycleLength);

    const periodStart = new Date(cycleStart);
    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + periodLength - 1);

    const ovulationDate = new Date(cycleEnd);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    const fertileWindowStart = new Date(ovulationDate);
    fertileWindowStart.setDate(fertileWindowStart.getDate() - 5);

    const fertileWindowEnd = new Date(ovulationDate);
    fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 1);

    predictions.push({
      cycleNumber: i + 1,
      cycleStart: cycleStart.toISOString(),
      cycleEnd: cycleEnd.toISOString(),
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      ovulationDate: ovulationDate.toISOString(),
      fertileWindowStart: fertileWindowStart.toISOString(),
      fertileWindowEnd: fertileWindowEnd.toISOString()
    });
  }

  return predictions;
};

module.exports = { calculateCycle };