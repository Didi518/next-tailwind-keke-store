import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/inscription', { name, email, password });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Créer un Compte">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Créer un Compte</h1>
        <div className="mb-4">
          <label htmlFor="name">Nom</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register('name', { required: "Merci d'entrer votre nom" })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>
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
                message: 'Le mot de passe doit comporter au moins 6 caractères',
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
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Merci de confirmer le mot de passe',
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'Le mot de passe doit comporter au moins 6 caractères',
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500">
                Les mots de passe ne correspondent pas
              </div>
            )}
        </div>
        <div className="mb-4">
          <button className="primary-button">S&apos;Inscrire</button>
        </div>
        <div className="mb-4">
          Déjà inscrit ? &nbsp;
          <Link href={`/connexion?redirect=${redirect || '/'}`}>
            Se connecter
          </Link>
        </div>
      </form>
    </Layout>
  );
}
