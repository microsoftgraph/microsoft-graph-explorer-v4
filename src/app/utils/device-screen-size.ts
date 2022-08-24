export function getDeviceScreenSize(deviceWidth: number){
    if(deviceWidth >= 1920){
      return 'xxxl';
    }
    else if(deviceWidth >= 1366){
      return 'xxl';
    }
    else if(deviceWidth >= 1365){
      return 'xl';
    }
    else if(deviceWidth >= 640){
      return 'l';
    }
    else if(deviceWidth >= 480){
      return 'm';
    }

    return 's';
  }