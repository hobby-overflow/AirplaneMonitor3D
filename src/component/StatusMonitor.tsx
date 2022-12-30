import React, { useEffect } from 'react';

export const StatusMonitor = (props: any) => {
  const elementId = 'statusMonitor';

  useEffect(() => {
    const elem = document.getElementById(elementId);

    if (elem != null) {
      props.statusMessage == ''
        ? (elem.style.visibility = 'collapse')
        : (elem.style.visibility = 'visible');

      props.statusCode == 0
        ? (elem.style.color = 'darkgreen')
        : (elem.style.color = 'red');
    }
  });

  return (
    <p id={elementId} style={{ visibility: 'collapse' }}>
      {props.statusMessage}
    </p>
  );
};
