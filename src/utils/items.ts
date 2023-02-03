import toastr from 'toastr';
import { fetchItemInfo } from '../api';
import { IItemProperties, IItemPropertyDescription, ISubItem } from '../interfaces';
import { TQuantityOfSales } from '../types';

const createItem = (appid: string, item: IItemPropertyDescription): void => {
  if (item.subitems.length !== 0) {
    const container: HTMLDivElement = document.createElement('div');

    container.classList.add('select-stp');
    container.innerHTML = `
    <svg class="select__arrow-stp" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" class=""></path></svg>
    <div class="select__label-stp" style="color: #${item.color}">${item.value}</div>
    <div class="select__options-stp">
      ${item.subitems
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
            href="https://steamcommunity.com/market/listings/${appid}/${el.market_hash_name}"
            target="_blank"
            style="color: #${item.color}"
          ><span class="item__name-stp">${el.name}</span><span class="item__price-stp"> ${el.price}</span></a
          >
        </div>
      `,
        )
        .join('')}
    </div>
    `;
    item.domNode = container;
  } else {
    const container: HTMLDivElement = document.createElement('div');

    container.classList.add('item__container-stp');
    container.innerHTML = `
      <div class="item__image-container-stp">
        <img
          class="item__image-stp"
          src="${item.image}"
        />
      </div>
      <a
        class="item-stp"
        href="https://steamcommunity.com/market/listings/${appid}/${item.market_hash_name}"
        target="_blank"
        style="color: #${item.color}"
      >${item.value}<span class="item__price-stp"> ${item.price}</span></a
      >
    `;
    item.domNode = container;
  }
};

const render = (item: IItemPropertyDescription) => {
  const divItems: Element[] = [...document.querySelectorAll('#largeiteminfo_item_descriptors .descriptor[style]')];
  const spanItems: Element[] = [...document.querySelectorAll('#largeiteminfo_item_descriptors span[style]')];
  let htmlItems: Element[];
  if (divItems.length !== 0) htmlItems = divItems;
  else if (spanItems.length !== 0) htmlItems = spanItems;
  else htmlItems = [];

  const htmlItem = htmlItems.find((el) => el?.textContent?.startsWith(item.value.trim())) as HTMLDivElement;
  htmlItem?.parentElement?.replaceChild(item.domNode, htmlItem);
};

const getSubItemsAndPrice = async (appid: string, item: IItemPropertyDescription): Promise<ISubItem[]> => {
  switch (appid) {
    case '730':
    case '440':
      return fetchItemInfo(appid, item.value, 100).then((r) =>
        r.success
          ? r.results
              .filter((subItem) => subItem.name.includes(item.value))
              .sort((a, b) => {
                if (a.sell_price > b.sell_price) return 1;
                if (a.sell_price < b.sell_price) return -1;
                return 0;
              })
              .map((subItem) => ({
                name: subItem.name,
                market_hash_name: subItem.hash_name,
                price: subItem.sale_price_text,
                image: `https://community.akamai.steamstatic.com/economy/image/${subItem.asset_description.icon_url}`,
              }))
          : [],
      );
    default:
      return [];
  }
};

export const findItemsInTreause = (appid: string, items: IItemProperties): IItemPropertyDescription[] => {
  switch (appid) {
    case '570': {
      return items.descriptions.filter(
        (el) =>
          ['b0c3d9', '5e98d9', '4b69ff', '8847ff', 'd32ce6', 'eb4b4b', 'e4ae39'].includes(
            ('color' in el && el.color) || '',
          ) &&
          !(el.value.includes('The International') || el.value.includes('Battle Pass Levels')) &&
          !el.value.includes('/') &&
          !el.value.includes('.'),
      );
    }
    case '730': {
      return items.descriptions.filter((el) =>
        ['b0c3d9', '5e98d9', '4b69ff', '8847ff', 'd32ce6', 'eb4b4b'].includes(('color' in el && el.color) || ''),
      );
    }
    case '440': {
      return items.descriptions.filter((el) =>
        ['6f6a63', 'b0c3d9', '5e98d9', '4b69ff', '8847ff', 'd32ce6', 'eb4b4b'].includes(
          ('color' in el && el.color) || '',
        ),
      );
    }
    default:
      return [];
  }
};

export const giveItemsPriceSetParams =
  (appid: string) =>
  async (item: IItemPropertyDescription): Promise<void> => {
    toastr.info(`Getting price for: ${item.value}`);
    item.subitems = await getSubItemsAndPrice(appid, item);

    if (item.subitems.length === 0) {
      const itemInfo = await fetchItemInfo(appid, item.value);
      if (itemInfo.success) {
        item.image = `https://community.akamai.steamstatic.com/economy/image/${itemInfo.results[0].asset_description.icon_url}`;
        item.price = itemInfo.results[0].sale_price_text;
        item.market_hash_name = itemInfo.results[0].hash_name;
      }
    }

    createItem(appid, item);
    render(item);
  };

export const renderQuantityOfSales = (prices: TQuantityOfSales, itemNode: Element | null) => {
  const container: HTMLDivElement = document.createElement('div');

  container.classList.add('select-stp');
  container.innerHTML = `
      <svg class="select__arrow-stp" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" class=""></path></svg>
      <div class="select__label-stp" style="color: #ffffff">Sales per day, week, month, year</div>
      <div class="select__options-stp">
        ${Object.entries(prices)
          .map(
            ([typeOfTime, quantity]) => `
          <div class="item__container-stp">
            <div
              class="item-stp"
              style="color: #ffffff"
            >${typeOfTime}: <span class="item__price-stp">${quantity}</span></div
            >
          </div>
        `,
          )
          .join('')}
      </div>
      `;
  itemNode?.insertAdjacentElement('beforeend', container);
};
