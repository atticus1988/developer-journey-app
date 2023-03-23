// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Database } from "../../lib/database";
import { User } from 'src/models/User';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User>
) {
  const fs = new Database();
  const session = await getSession({ req });
  const username = session?.user?.name || '';
  if (!username) {
    return res.status(200).send({ username, completedMissions: [] });
  }

  if (req.method === 'POST') {
    const missionId = req.body.id;
    await fs.addCompletedMission({ username, missionId })
  }

  const user = await fs.getUser({ username });
  res.status(200).json(user)
}
