export function getBrowserScreenSize(browserWidth: number){
  if(browserWidth >= 1920){
    return 'xxxl';
  }
  else if(browserWidth >= 1366){
    return 'xxl';
  }
  else if(browserWidth >= 1024){
    return 'xl';
  }
  else if(browserWidth >= 640){
    return 'l';
  }
  else if(browserWidth >= 480){
    return 'm';
  }

  return 's';
}

export function getDeviceScreenScale(){
  const scaleString = (window.devicePixelRatio * 100).toFixed(0);

  matchMedia(`(resolution: ${scaleString})dppx`).addEventListener('change',
    getDeviceScreenScale, {once: true})

  return `${scaleString}%`;
}