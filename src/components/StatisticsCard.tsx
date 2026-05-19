interface StatisticItem {
  label: string;
  value: number | string;
}

interface StatisticsCardProps {
  items: StatisticItem[];
  columns?: number;
  className?: string;
}

function StatisticsCard({
  items,
  columns = 3,
  className = "mb-6",
}: StatisticsCardProps) {
  // 分組統計項目，按指定列數分行
  const groupedItems = [];
  for (let i = 0; i < items.length; i += columns) {
    groupedItems.push(items.slice(i, i + columns));
  }

  // 根據列數確定 grid 的 CSS 類名
  const getGridColsClass = (cols: number) => {
    const colsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };
    return colsMap[Math.min(Math.max(cols, 1), 6)] || "grid-cols-3";
  };

  return (
    <>
      {groupedItems.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}
        >
          <div className={`grid ${getGridColsClass(group.length)} gap-8`}>
            {group.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex flex-col items-center justify-center text-center"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {item.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default StatisticsCard;
