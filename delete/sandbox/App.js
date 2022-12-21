import "./App.css";
// import Forecast from "../components/Forecast.js";
import Forecast from "../components/Forecast";
import Square from "./Variants";
// import Chart from "./FirefoxChart2";
import Test from "./Ztest2";
import testData from "../utils/testData";
import decode from "../utils/decodeForecastData";

function App() {
    return (
        <>
            {/* <Square /> */}
            {/* <Forecast width={400} height={200} /> */}
            <Forecast />
            {/* <Chart data={decode(testData)} height="200px" width={200} /> */}
        </>
    );
}

export default App;
