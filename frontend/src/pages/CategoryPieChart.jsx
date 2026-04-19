import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryPieChart() {

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {

      const res = await axios.get("http://127.0.0.1:5000/admin/category-analysis");

      if (res.data.success) {

        const labels = res.data.data.map(item => item.category);
        const counts = res.data.data.map(item => item.count);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Most Issued Categories",
              data: counts,
              backgroundColor: [
                "#3b82f6",
                "#22c55e",
                "#f59e0b",
                "#ef4444",
                "#8b5cf6",
                "#06b6d4"
              ],
              borderWidth: 1
            }
          ]
        });

      }

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div style={{ width: "500px", marginTop: "40px" }}>

      <h2>Most Issued Book Categories</h2>

      {chartData && <Pie data={chartData} />}

    </div>

  );

}

export default CategoryPieChart;