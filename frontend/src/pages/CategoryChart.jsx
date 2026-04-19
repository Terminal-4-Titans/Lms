import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function CategoryChart() {

    const [chartData, setChartData] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {

        try {

            const res = await axios.get("http://127.0.0.1:5000/admin/category-analysis")

            if (res.data.success) {

                const labels = res.data.data.map(item => item.category)
                const counts = res.data.data.map(item => item.count)

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: "Issued Books",
                            data: counts,
                            backgroundColor: "rgba(54,162,235,0.6)"
                        }
                    ]
                })

            }

        } catch (error) {
            console.log(error)
        }

    }

    return (

        <div style={{ width: "70%", marginTop: "40px" }}>

            <h2>Most Issued Book Categories</h2>

            {chartData && <Bar data={chartData} />}

        </div>

    )

}

export default CategoryChart