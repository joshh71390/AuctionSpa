import { useState, useEffect } from "react";
import moment from "moment";

export function useCounter({openDate, closeDate}) {
    const [counter, setCounter] = useState(null);
    const currentTime = moment().utc(true).local().toISOString("dd/mm/yyyy HH:mm");
    const currentUtcTime = moment().utc().toISOString("dd/mm/yyyy HH:mm");
  
    useEffect(() => {
      let duration;
      if (openDate > currentTime) {
        let eventTime = moment(openDate).utc(true).local();
        duration = moment.duration(eventTime.diff(currentTime));
      } else if (openDate < currentTime && closeDate > currentTime) {
        let eventTime = moment(closeDate).utc(true).local();
        duration = moment.duration(eventTime.diff(currentTime));
      }
  
      const interval = 1000;
  
      let timeout;
      if (!counter) {
        timeout = setTimeout(() => {
          setCounter(duration);
        }, 500);
      }
  
      const timer =
        counter &&
        setInterval(() => {
          if (counter.milliseconds() < 0 && duration < 0) {
            return clearInterval(timer);
          }
          duration = moment.duration(duration - interval, "milliseconds");
          setCounter(duration);
        }, interval);
      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    }, [counter, currentTime]);
  
    return {
      counter,
      currentUtcTime,
    };
  }