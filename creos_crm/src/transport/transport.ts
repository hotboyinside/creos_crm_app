interface ITransport {
    protocol: string,
    hostName: string,
    versionPath: string,
    route: string,
    limit?: number

    getData<T>(route: string): Promise<T>;
}

export class Transport implements ITransport {
    private static instance: Transport;
    protocol: string = 'https://';
    hostName: string = 'sandbox.creos.me/';
    versionPath: string = 'api/v1/';
    route: string = 'comment/?ordering=-date_created';
    limit: number = 10;
    private constructor() {}
  
    public static getInstance(): Transport {
        if (!Transport.instance) {
            Transport.instance = new Transport();
        }
        return Transport.instance;
    }

    public async getData<T>(route: string): Promise<T> {
        const response = await fetch(`${this.protocol + this.hostName + this.versionPath + route}`);
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        return await response.json()
    }
}