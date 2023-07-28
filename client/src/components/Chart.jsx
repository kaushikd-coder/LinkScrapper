import React from 'react';
import { Bar  } from 'react-chartjs-2';
import { Chart as ChartJs } from "chart.js/auto"


const Chart = ({ priceData, type }) => {
    const formatAMPM = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    };

    // Extracting data and labels from the priceData array
    let data;
    if (type === "Reviews") {
        data = priceData.map((entry) => entry.reviews.toString().replace(/,/g, ''));
    } else if (type === "Ratings") {
        data = priceData.map((entry) => entry.ratings.toString().replace(/,/g, ''));
    } else {
        data = priceData.map((entry) => entry.price.replace(/[₹,]/g, ''));
    }

    console.log(data)
    const labels = priceData.map((entry) => {
        const date = new Date(entry.date);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${formatAMPM(date)}`;
    });
    console.log(labels)


    let borderColor,backgroundColor;

    if (type === 'Ratings') {
        borderColor = 'rgb(192, 192, 75)';
        backgroundColor = 'rgba(0, 128, 0, 0.1)';
    } else if (type === 'Reviews') {
        borderColor = 'rgb(192, 75, 192)';
        backgroundColor = 'rgba(0, 0, 255, 0.1)'; 
    } else {
        borderColor = 'rgb(75, 192, 192)';
        backgroundColor = 'rgba(255, 0, 0, 0.1)';
    }

    let chartData = {
        labels: labels,
        datasets: [
            {
                label: type,
                data: data,
                fill: false,
                borderColor,
                backgroundColor: backgroundColor,
                tension: 0.1,
            },
        ],
    };

    const chartOptions =
    {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }

    return (
        <div>
            <Bar  data={chartData} options={chartOptions} />
        </div>
    );
};

export default Chart;
