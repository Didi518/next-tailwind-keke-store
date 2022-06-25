import { getSession } from 'next-auth/react';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('Erreur: connexion requise');
  }
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    if (order.isPaid) {
      return res
        .status(400)
        .send({ message: 'Erreur: la commande est déjà payée' });
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await order.save();
    await db.disconnect();
    res.send({
      message: 'Le règlement de la commande est validé',
      order: paidOrder,
    });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Erreur: commande introuvable' });
  }
};

export default handler;
