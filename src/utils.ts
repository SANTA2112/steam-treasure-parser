type Groups = {
  [key: string]: string;
};

type Cookie = {
  browserid: string;
  timezoneOffset: string;
  steamCountry: string;
  recentapps: string;
  sessionid: string;
  app_impressions: string;
  Steam_Language: string;
};

interface Init {
  gameID: number;
  itemName: string;
  currency: number;
  lng: string;
}

export const init = (): Init => {
  const parsedString = window.location.href.match(
    /https?:\/\/steamcommunity.com\/market\/listings\/(?<gameID>\d+)\/(?<itemName>.+)\/?/
  )!;
  const { gameID, itemName } = parsedString.groups as Groups;
  const lng =
    document.cookie
      .split('; ')
      .reduce((acc, cur) => ({ ...acc, [cur.split('=')[0]]: cur.split('=')[1] }), {} as Partial<Cookie>)
      .Steam_Language === 'english'
      ? 'EN'
      : 'RU';

  const currency = lng === 'EN' ? 1 : 5;
  return { gameID: +gameID, itemName, currency, lng };
};
