import toastr from 'toastr';
import { fetchCSItemInfo, fetchItemInfo, getMarketHashName } from '../api';
import type { Description, QueryData, SubItem } from '../interfaces';
import type { TQuantityOfSales } from '../types';
import type { API } from '../api.types';

const createItem = (item: SubItem, subitems: SubItem[]): HTMLDivElement => {
  const container: HTMLDivElement = document.createElement('div');
  container.classList.add(subitems.length !== 0 ? 'select-stp' : 'item__container-stp');

  if (subitems.length !== 0) {
    container.innerHTML = `<svg class="select__arrow-stp" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="#${item.color}" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg>
        <div class="select__label-stp" style="color: #${item.color}">${item.market_hash_name}</div>
        <div class="select__options-stp">
        ${subitems
          .map(
            (el) => `
          <div class="item__container-stp">
            <div class="item__image-container-stp">
              <img
                class="item__image-stp"
                src="${el.image}"
              />
            </div>
            <a
              class="item-stp item-stp__item"
              href="${el.link}"
              target="_blank"
              style="color: #${item.color}"
            ><span class="item__name-stp">${el.market_hash_name}</span><span class="item__price-stp"> ${el.price}</span></a
            >
          </div>
        `,
          )
          .join('')}
        </div>`;
  } else {
    container.innerHTML = `<div class="item__image-container-stp">
          <img class="item__image-stp" src="${item.image}" />
        </div>
        <a class="item-stp item-stp__item" href="${item.link}" target="_blank" style="color: #${item.color}">
          <span class="item__name-stp">${item.market_hash_name}</span>
          <span class="item__price-stp"> ${item.price}</span>
        </a>`;
  }
  return container;
};

export const findSubItemOnPage = (itemName: string) => {
  const descriptors = document.querySelectorAll<HTMLDivElement>('div[style^="--direction:"] div');
  const htmlItem = Array.from(descriptors).find((el) => el?.textContent?.startsWith(itemName));
  return htmlItem ?? null;
};

const render = (itemName: string, container: HTMLDivElement) => {
  const htmlItem = findSubItemOnPage(itemName);
  if (htmlItem) {
    container.classList.add(...Array.from(htmlItem.classList));
    htmlItem.removeAttribute('style');
    htmlItem.parentElement?.replaceChild(container, htmlItem);
  }
};

const addCSOptionsForLink = (link: string, filters: API.CSItemBuskets['buckets'][0]['filters']) => {
  const url = new URL(link);
  filters.forEach((params) => {
    const [key, value] = params;
    if (key === 'Quality') {
      url.searchParams.set('category_730_Quality', `tag_${value}`);
    }
    if (key === 'Exterior') {
      url.searchParams.set('category_730_Exterior', `tag_${value}`);
    }
  });

  return url.toString();
};

const getSubItemsAndPrice = async (appid: string, item: Description): Promise<SubItem[]> => {
  if (appid !== '730' && appid !== '440') {
    return [];
  }

  if (appid === '730') {
    const marketHashName = await getMarketHashName(item.value).then((items) => items.at(0)?.market_hash_name ?? null);
    if (!marketHashName) return [];

    const itemInfo = await fetchCSItemInfo(appid, marketHashName);
    const buskets = itemInfo.find((el) => 'buckets' in el)?.buckets;
    const queryDataString = itemInfo.find((el) => 'queryData' in el)?.queryData;

    if (!buskets || !queryDataString) return [];

    const queryData = JSON.parse(queryDataString) as QueryData;
    const descriptions = queryData.queries.filter((el) => el.queryKey.includes('description'));

    return buskets
      .toSorted((a, b) => parseFloat(b.strPrice) - parseFloat(a.strPrice))
      .map((subItem) => {
        const itemUrl = descriptions.find((el) => el.queryKey.includes(subItem.bucket_id))?.state.data.icon_url ?? null;
        return {
          market_hash_name: subItem.bucket_id,
          price: subItem.strPrice,
          link: addCSOptionsForLink(
            `https://steamcommunity.com/market/listings/${appid}/${marketHashName}`,
            subItem.filters,
          ),
          color: item.color ?? null,
          image: `https://community.akamai.steamstatic.com/economy/image/${itemUrl}`,
        };
      });
  }

  if (appid === '440') {
    const itemsNames = await getMarketHashName(item.value);
    const results = [];
    for (let itemName of itemsNames) {
      const { listings, total_count } = await fetchItemInfo(appid, itemName.market_hash_name);
      if (total_count === 0) {
        continue;
      }
      const itemInfo = listings.find((el) => 'description' in el);
      if (!itemInfo) {
        continue;
      }
      results.push({
        market_hash_name: itemName.market_hash_name,
        price: itemInfo.strSubtotal,
        link: `https://steamcommunity.com/market/listings/${appid}/${itemName.market_hash_name}`,
        color: item.color ?? null,
        image: itemName.icon_url,
      });
    }
    return results;
  }

  return [];
};

export const findItemsInTreause = (appid: string, items: Description[]): Description[] => {
  const validColors = ['b0c3d9', '5e98d9', '4b69ff', '8847ff', 'd32ce6', 'eb4b4b', 'e4ae39', 'ade55c'];
  switch (appid) {
    case '570': {
      return items.filter(
        (el) =>
          validColors.includes(('color' in el && el.color.toLowerCase()) || '') &&
          !el.value.includes('The International') &&
          !el.value.includes('Battle Pass Levels') &&
          !el.value.includes('/') &&
          !el.value.includes('.'),
      );
    }
    case '730': {
      return items.filter((el) => validColors.includes(('color' in el && el.color.toLowerCase()) || ''));
    }
    case '440': {
      return items.filter((el) =>
        validColors.concat('6f6a63').includes(('color' in el && el.color.toLowerCase()) || ''),
      );
    }
    default:
      return [];
  }
};

export const giveItemsPricesSetParams = (appid: string) => async (item: Description) => {
  toastr.info(`Getting price for: ${item.value}`);
  const subitems = await getSubItemsAndPrice(appid, item);
  const mainItem: SubItem = {
    price: '',
    image: '',
    color: item.color ?? null,
    link: '',
    market_hash_name: item.value,
  };

  if (subitems.length === 0) {
    const itemData = await fetchItemInfo(appid, item.value);
    const { listings, total_count } = itemData;
    if (total_count === 0) {
      toastr.error(`Info for item: ${item.value} not found`);
      return;
    }
    const itemInfo = listings.toSorted((a, b) => parseFloat(b.strSubtotal) - parseFloat(a.strSubtotal)).at(0);
    if (!itemInfo?.description) {
      toastr.error(`Info for item: ${item.value} not found`);
      return;
    }
    const { icon_url, market_hash_name } = itemInfo.description;
    const price = itemInfo.strSubtotal;
    const image = `https://community.akamai.steamstatic.com/economy/image/${icon_url}`;
    const color = item.color ?? null;
    const link = `https://steamcommunity.com/market/listings/${appid}/${item.value}`;

    const mainItem: SubItem = { price, image, color, link, market_hash_name };
    const container = createItem(mainItem, []);
    return render(item.value, container);
  }

  const container = createItem(mainItem, subitems);
  return render(item.value, container);
};

export const renderQuantityOfSales = (prices: TQuantityOfSales, itemNode: Element | null) => {
  const container = document.createElement('div');
  const options = Object.entries(prices)
    .map(
      ([typeOfTime, quantity]) =>
        `<div class="quantity-sales-item-stp">${typeOfTime}: <span class="total-value-stp">${quantity}</span></div>`,
    )
    .join('');

  container.classList.add('sales-stp');
  container.innerHTML = `<div class="quantity-sales-heading-stp">Sales count:</div>
      <div class="quantity-sales-wrapper-stp">${options}</div>`;

  itemNode?.insertAdjacentElement('beforeend', container);
};
