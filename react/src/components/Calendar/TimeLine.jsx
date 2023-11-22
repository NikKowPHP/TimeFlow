import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { updateCurrentTime } from "../../redux/actions/timeActions";

const TimeLine = ({ currentTime, updateCurrentTime }) => {
  const [linePositionStyle, setLinePositionStyle] = useState({ top: '1px' });
  const dispatch = useDispatch();

  useEffect(() => {
     setInterval(() => {
      const newTime = new Date();
      dispatch(updateCurrentTime(newTime));
    }, 300000);
  }, [updateCurrentTime]);
  useEffect(() => {
    const linePosition = calculateLinePosition();
    setLinePositionStyle({ top: `${linePosition}px` });
  }, [currentTime]);

  const calculateLinePosition = () => {
    const totalHours = 24;
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const percentage = ((hours * 60 + minutes) / (totalHours * 60)) * 45;
    return percentage;
  };

  return <div className="current-time-line" style={linePositionStyle}></div>;
};

const mapStateToProps = (state) => ({
  currentTime: state.time.currentTime,
});

const mapDispatchToProps = {
  updateCurrentTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeLine);
