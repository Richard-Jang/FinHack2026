const SpendingBreakdownChart = () => {
  let cumulativePercent = 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden p-5">
      <div className="flex items-center space-x-2 mb-6">
        <PieChart size={20} className="text-purple-600 dark:text-purple-400" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Spending Breakdown</h2>
      </div>
      
      <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between gap-8 md:px-4">
        
        {/* Custom SVG Donut Chart */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-gray-100 dark:text-gray-700"></circle>
            
            {/* Dynamic Slices */}
            {SPENDING_CATEGORIES.map((cat) => {
              const offset = -cumulativePercent;
              cumulativePercent += cat.percentage;
              return (
                <circle
                  key={cat.id}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke={cat.stroke}
                  strokeWidth="4"
                  strokeDasharray={`${cat.percentage} ${100 - cat.percentage}`}
                  strokeDashoffset={offset}
                  className="transition-all duration-1000 ease-out hover:opacity-80 hover:stroke-[5px] cursor-pointer"
                ></circle>
              );
            })}
          </svg>
          {/* Center Total Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">$1,085</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Spent</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-4">
          {SPENDING_CATEGORIES.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-3.5 h-3.5 rounded-full ${cat.bg}`}></div>
                <span className="font-medium text-gray-700 dark:text-gray-200">{cat.name}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900 dark:text-white block">${cat.amount}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{cat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};


const UpcomingBillsTimeline = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
        <Calendar size={20} className="text-purple-600 dark:text-purple-400" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Bills</h2>
      </div>
      <div className="p-5 relative">
        {/* Vertical connecting line */}
        <div className="absolute left-[33px] top-8 bottom-8 w-0.5 bg-gray-100 dark:bg-gray-700"></div>

        <div className="space-y-6 relative">
          {MOCK_UPCOMING_BILLS.map((bill) => (
            <div key={bill.id} className="flex items-start">
              {/* Timeline Dot */}
              <div className="flex flex-col items-center mr-4 relative z-10">
                <div className={`h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 ${
                  bill.daysAway <= 3 ? 'bg-red-500' : 'bg-purple-500'
                }`}></div>
              </div>
              {/* Bill Card */}
              <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700/50 mt-[-10px] hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-900 dark:text-white">{bill.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${bill.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Due: {bill.date}</span>
                  <span className={`font-medium ${
                    bill.daysAway <= 3 ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'
                  }`}>
                    In {bill.daysAway} days
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
