import {
    BsCaretLeft,
    BsCaretLeftFill,
    BsCaretRight,
    BsCaretRightFill,
} from "react-icons/bs";
import {
    IoExpand,
    IoContract,
    IoClose,
    IoExpandSharp,
    IoCaretDownCircleOutline,
} from "react-icons/io5";
import GlobalChart from "./GlobalChart";

const GlobalChartControls = ({
    toggleFullscreen,
    previousChart,
    nextChart,
    dateString,
    changeDay,
}) => {
    return (
        <div className="global-chart_controls-container">
            <div className="global-chart_time-controls">
                <button
                    className="change-day change-day--previous"
                    disabled={previousChart.data ? false : true}
                    onClick={() => changeDay(-1)}
                >
                    <BsCaretLeft className="change-day_icon" />
                    <BsCaretLeftFill className="change-day_icon--hover" />
                </button>
                <h4>{dateString}</h4>
                {/* <h4>{`${day.getMonth()}, ${day.getDate()}`}</h4> */}
                <button
                    className="change-day change-day--next"
                    disabled={nextChart.data ? false : true}
                    onClick={() => changeDay(1)}
                >
                    <BsCaretRight className="change-day_icon" />
                    <BsCaretRightFill className="change-day_icon--hover" />
                </button>
            </div>
            <TextRadio
                groupName="Temperature"
                options={["UTCI", "WBGT"]}
                selection={thermalIndex}
                setSelection={setThermalIndex}
                className="thermal-index-selection"
            />
            <TextRadio
                groupName="High-or-Low"
                options={["Highs", "Lows"]}
                selection={highLow}
                setSelection={setHighLow}
                className="high-low-selection"
            />
            <button
                className="global-chart_fullscreen-button"
                onClick={toggleFullscreen}
            >
                <IoExpand />
            </button>
        </div>
    );
};

export default GlobalChartControls;
