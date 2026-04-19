import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function UserCategoryPieChart() {

    const [chartData, setChartData] = useState(null)

    useEffect(() => {
        fetchChartData()
    }, [])

    const fetchChartData = async () => {

        try {

            const userId = localStorage.getItem("user_id")

            const res = await axios.get(
                `http://127.0.0.1:5000/user/user-category-analysis/${userId}`
            )

            if (res.data.success) {

                const labels = res.data.data.map(item => item.category)
                const counts = res.data.data.map(item => item.count)

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: "My Borrowed Categories",
                            data: counts,
                            backgroundColor: [
                                "#3b82f6",
                                "#22c55e",
                                "#f59e0b",
                                "#ef4444",
                                "#8b5cf6",
                                "#06b6d4"
                            ]
                        }
                    ]
                })

            }

        } catch (error) {
            console.log(error)
        }

    }

    return (

        <div style={{ width: "400px", marginTop: "40px" }}>

            <h2>Popular Book Categories</h2>

            {chartData && <Pie data={chartData} />}

        </div>

    )

}

export default UserCategoryPieChart