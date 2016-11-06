import { IFlyWebPublishedServer, FlyWebPublishOptions } from 'app/interfaces';


// extends the stadard navigator by adding the 'publishServer' method
// defined in: https://github.com/flyweb/spec
// currently, only Firefox Nightly supports this spec.
export interface INavigator extends Navigator {
    publishServer(name: string, options: FlyWebPublishOptions): Promise<IFlyWebPublishedServer>;
}
