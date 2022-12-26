import React, {useEffect, useState} from "react"

export const StatusMonitorHooks = (props: any) => {
  let elementId = 'statusMonitor';
  let isFirst = true;

  useEffect(() => {
    if (isFirst) {
      const elem = document.getElementById(elementId) as HTMLParagraphElement;
      elem.style.visibility = 'collapse';
      isFirst = false;
    }

    if (!isFirst) {
      const elem = document.getElementById(elementId) as HTMLParagraphElement;
      elem.style.visibility = 'visible';
      if (elem != null) {
        if (props.statusCode == 0) {
          elem.style.color = 'darkgreen';
        } else {
          elem.style.color = 'red';
        }
      }
    }
  });

  return (
    <p id={elementId}>{props.statusMessage}</p>
  )
}
