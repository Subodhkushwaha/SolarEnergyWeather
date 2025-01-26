document.getElementById('getEnergyData').addEventListener('click', function () {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    const API_KEY = "30e507cafa50d2321e716e407267d396"; // Replace with secure handling
    const PANEL_AREA = 2.0;
    const PANEL_EFFICIENCY = 0.18; // 18%

    // Fetch weather data
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const temperature = data.main.temp;
                const humidity = data.main.humidity;
                const clouds = data.clouds.all;

                // Calculate solar energy output
                const irradiance = 5.5 * (1 - clouds / 100); // Approximation
                const energyOutput = irradiance * PANEL_AREA * PANEL_EFFICIENCY;

                // Update UI with results
                document.getElementById('temperature').textContent = `Temperature: ${temperature}°C`;
                document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
                document.getElementById('clouds').textContent = `Cloud Cover: ${clouds}%`;
                document.getElementById('irradiance').textContent = `Estimated Solar Irradiance: ${irradiance.toFixed(2)} kWh/m²/day`;
                document.getElementById('energyOutput').textContent = `Solar Energy Output: ${energyOutput.toFixed(2)} kWh`;

                // Visualize results
                visualizeResults(irradiance, energyOutput);
            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => alert('Error fetching data: ' + error.message));
});

// Function to visualize results
let barChart, scatterChart;

function visualizeResults(irradiance, energyOutput) {
    const barChartCtx = document.getElementById('barChart').getContext('2d');
    const scatterChartCtx = document.getElementById('scatterChart').getContext('2d');

    // Destroy previous charts if they exist
    if (barChart) barChart.destroy();
    if (scatterChart) scatterChart.destroy();

    // Bar chart
    barChart = new Chart(barChartCtx, {
        type: 'bar',
        data: {
            labels: ["Solar Irradiance", "Energy Output"],
            datasets: [{
                label: 'Solar Energy Metrics',
                data: [irradiance, energyOutput],
                backgroundColor: ['orange', 'green'],
                borderColor: ['darkorange', 'darkgreen'],
                borderWidth: 1
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } },
            responsive: true
        }
    });

    // Scatter chart
    scatterChart = new Chart(scatterChartCtx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Cloud Cover Impact on Solar Energy',
                data: [{ x: irradiance, y: energyOutput }],
                backgroundColor: 'red',
                pointRadius: 10
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Solar Irradiance (kWh/m²/day)' } },
                y: { title: { display: true, text: 'Energy Output (kWh)' } }
            }
        }
    });
}
