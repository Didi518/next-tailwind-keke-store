import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

export default function ShippingScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;
  const router = useRouter();

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('city', shippingAddress.city);
    setValue('country', shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, postalCode, city, country }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, postalCode, city, country },
    });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          postalCode,
          city,
          country,
        },
      })
    );
    router.push('/paiement');
  };

  return (
    <Layout title="Adresse de Livraison">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Adresse de Livraison</h1>
        <div className="mb-4">
          <label htmlFor="Nom Complet">Nom Complet</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register('fullName', {
              required: 'Merci de renseigner votre nom complet',
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="adresse">Adresse</label>
          <input
            className="w-full"
            id="address"
            autoFocus
            {...register('address', {
              required: 'Merci de renseigner votre adresse',
              minLength: {
                value: 3,
                message: "L'adresse doit comporter au moins 3 caractères",
              },
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="Code Postal">Code Postal</label>
          <input
            className="w-full"
            id="postalCode"
            autoFocus
            {...register('postalCode', {
              required: 'Merci de renseigner votre code postal',
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500">{errors.postalCode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="Ville">Ville</label>
          <input
            className="w-full"
            id="city"
            autoFocus
            {...register('city', {
              required: 'Merci de renseigner votre ville',
            })}
          />
          {errors.city && (
            <div className="text-red-500">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="Pays">Pays</label>
          <input
            className="w-full"
            id="country"
            autoFocus
            {...register('country', {
              required: 'Merci de renseigner votre nom complet',
            })}
          />
          {errors.country && (
            <div className="text-red-500">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Continuer</button>
        </div>
      </form>
    </Layout>
  );
}

ShippingScreen.auth = true;
