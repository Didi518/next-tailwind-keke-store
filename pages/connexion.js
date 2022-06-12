import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';

export default function LoginScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const submitHandler = ({ email, password }) => {
    console.log(email, password);
  };

  return (
    <Layout title="Connexion">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Connexion</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register('email', {
              required: "Merci d'entrer votre adresse e-mail",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Adresse e-mail invalide',
              },
            })}
            className="w-full"
            id="email"
            autoFocus
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            {...register('password', {
              required: 'Merci de renseigner votre mot de passe',
              minLength: {
                value: 6,
                message: 'Le mot de passe doit avoir plus de cinq caractères',
              },
            })}
            className="w-full"
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Se connecter</button>
        </div>
        <div className="mb-4">
          Pas encore inscrit ? &nbsp;
          <Link href="inscription">Inscription</Link>
        </div>
      </form>
    </Layout>
  );
}
