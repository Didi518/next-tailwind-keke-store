import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import { Store } from '../utils/Store';
import { getError } from '../utils/error';
import Cookies from 'js-cookie';

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  ); //123,456 => 123,46

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const router = useRouter();
  useEffect(() => {
    if (!paymentMethod) {
      router.push('/paiement');
    }
  }, [paymentMethod, router]);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/commandes', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/commande/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Validation">
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl">Valider la Commande</h1>
      {cartItems.length === 0 ? (
        <div>
          Le panier est vide. <Link href="/">Aller le remplir</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Adresse de Livraison</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.postalCode}, {shippingAddress.city},{' '}
                {shippingAddress.country}
              </div>
              <div>
                <Link href="/commande">Modifier</Link>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Mode de Paiement</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link href="/paiement">Modifier</Link>
              </div>
            </div>
            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Articles commandés</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="p-5 text-left">Article</th>
                    <th className="p-5 text-right">Quantité</th>
                    <th className="p-5 text-right">Prix</th>
                    <th className="p-5 text-right">Sous-Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link href={`/articles/${item.slug}`}>
                          <a className="flex items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                          </a>
                        </Link>
                      </td>
                      <td className="p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">{item.price}</td>
                      <td className="p-5 text-right">
                        {item.quantity * item.price}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href="/panier">Modifier</Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Résumé de la Commande</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Articles</div>
                    <div>{itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Taxes</div>
                    <div>{taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Livraison</div>
                    <div>{shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>{totalPrice}</div>
                  </div>
                </li>
                <li>
                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="primary-button w-full"
                  >
                    {loading ? 'Chargement...' : 'Valider la Commande'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

PlaceOrderScreen.auth = true;
