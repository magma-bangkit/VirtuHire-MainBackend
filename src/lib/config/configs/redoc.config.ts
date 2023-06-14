import { RedocOptions } from 'nestjs-redoc';

export const redocOptions: RedocOptions = {
  title: 'VirtuHire Documentation',
  logo: {
    backgroundColor: '#F0F0F0',
    altText: 'VirtuHire Logo',
  },
  sortPropsAlphabetically: true,
  hideDownloadButton: false,
  hideHostname: false,
  redocVersion: 'latest',
};
