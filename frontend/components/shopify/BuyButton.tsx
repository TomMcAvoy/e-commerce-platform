'use client';

import { useEffect } from 'react';

interface BuyButtonProps {
  productId: string;
  variantId: string;
  domain: string;
  accessToken: string;
}

export default function ShopifyBuyButton({ productId, variantId, domain, accessToken }: BuyButtonProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    script.onload = () => {
      // @ts-ignore
      window.ShopifyBuy.UI.onReady(() => {
        // @ts-ignore
        const client = window.ShopifyBuy.buildClient({
          domain: domain,
          storefrontAccessToken: accessToken,
        });

        // @ts-ignore
        window.ShopifyBuy.UI.init(client).then((ui) => {
          ui.createComponent('product', {
            id: productId,
            variantId: variantId,
            node: document.getElementById(`shopify-buy-${productId}`),
            moneyFormat: '${{amount}}',
            options: {
              product: {
                styles: {
                  button: {
                    'background-color': '#000000',
                    'color': '#ffffff',
                    ':hover': { 'background-color': '#333333' }
                  }
                }
              }
            }
          });
        });
      });
    };
    document.head.appendChild(script);
  }, [productId, variantId, domain, accessToken]);

  return <div id={`shopify-buy-${productId}`}></div>;
}