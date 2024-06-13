import { getWorkoutSessions } from "../../utils/apiWorkoutSession";
import { useState, useEffect } from "react";
import { BarChart, barElementClasses } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import SelectMenu from "../Shared Components/Select";
import Card from "../Shared Components/Card";
import "../../styles/components/Plot/_Plot.scss";

const PlotSection = ({ weekStart, workoutTypeOptions }) => {
  const [selectedWorkoutTypeValue, setSelectedWorkoutTypeValue] = useState("");
  const [plotData, setPlotData] = useState([]);

  const fetchSessions = async () => {
    const sessions = await getWorkoutSessions({
      week: weekStart.toISOString().split("T")[0],
      type: selectedWorkoutTypeValue,
      duration: true,
    });
    const totalWorkoutDurationPerWeekday = Object.values(
      sessions.duration_min_by_date
    );

    setPlotData(totalWorkoutDurationPerWeekday);
  };

  useEffect(() => {
    fetchSessions();
  }, [selectedWorkoutTypeValue, weekStart]);

  return (
    <Card>
      <div id='plot-container'>
        <div>
          <SelectMenu
            label='workout'
            options={workoutTypeOptions}
            selected={workoutTypeOptions[0].value}
            setSelected={setSelectedWorkoutTypeValue}
          />
        </div>
        <BarChart
          series={[{ data: plotData, color: "#3245e5" }]}
          height={290}
          xAxis={[
            {
              data: ["Sat", "Mon", "Tues", "Wed", "Thu", "Fri", "Sun"],
              scaleType: "band",
            },
          ]}
          yAxis={[{ label: "duration (min)", color: "#FFFFF" }]}
          margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          sx={customChartStyles()}
        />
      </div>
    </Card>
  );
};

const customChartStyles = () => ({
  [`.${barElementClasses.root}`]: {
    strokeWidth: 2,
  },
  [`.${axisClasses.root}`]: {
    [`.${axisClasses.tick}, .${axisClasses.line}`]: {
      stroke: "#FFFFFF",
      strokeWidth: 1,
    },
    [`.${axisClasses.tickLabel}`]: {
      fill: "#FFFFFF",
    },
  },
  "& .css-1k2u9zb-MuiChartsAxis-root .MuiChartsAxis-label": {
    strokeWidth: "0.4",
    fill: "#FFFFFF",
  },
  border: `1px solid rgba(${"255,255,255"}, 0.1)`,
  backgroundImage: `linear-gradient(rgba(${"255,255,255"}, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(${"255,255,255"}, 0.1) 1px, transparent 1px)`,
  backgroundSize: "35px 35px",
  backgroundPosition: "20px 20px, 20px 20px",
});

export default PlotSection;
