import { IChoiceGroupOption } from '@fluentui/react';
import { clouds, globalCloud } from '.';
import { geLocale } from '../../appLocale';

export class Sovereign {
  protected profile = null;

  constructor(profile: any) {
    this.profile = profile;
  }
  public getOptions(): IChoiceGroupOption[] {
    let options: IChoiceGroupOption[] = [];

    clouds.forEach(cloud => {
      options.push({
        key: cloud.name,
        text: cloud.name
      });
    });

    options.unshift({
      key: globalCloud.name,
      text: globalCloud.name
    });

    if (!this.canAccessCanary()) {
      options = options.filter(option => option.key !== 'Canary');
    }

    if (!this.canAccessChinaCloud()) {
      options = options.filter(option => option.key !== 'China');
    }
    return options;
  }

  private canAccessChinaCloud() {
    return geLocale === 'en-US';
  }

  private canAccessCanary() {
    if (!this.profile) {
      return false;
    }

    const { emailAddress }: any = this.profile;
    return (emailAddress && emailAddress.includes('.onmicrosoft.com'));
  }
}


