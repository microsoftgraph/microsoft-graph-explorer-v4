export function getBrowserScreenSize(browserWidth: number){
  if(browserWidth >= 1920){
    return 'xxxl >= 1920';
  }
  else if(browserWidth >= 1366){
    return 'xxl >= 1366';
  }
  else if(browserWidth >= 1024){
    return 'xl >= 1024';
  }
  else if(browserWidth >= 640){
    return 'l >= 640';
  }
  else if(browserWidth >= 480){
    return 'm >= 480';
  }

  return 's < 480';
}

export function getDeviceScreenScale(){
  const scaleString = (window.devicePixelRatio * 100).toFixed(0);

  matchMedia(`(resolution: ${scaleString})dppx`).addEventListener('change',
    getDeviceScreenScale, {once: true})

  return `${scaleString}%`;
}