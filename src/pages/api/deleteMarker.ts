import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("ritcher-map");
    const { id } = req.body;

    const marker = await db.collection("markers").deleteOne({
      _id: new ObjectId(id),
    });

    res.json(marker);
  } catch (e) {
    console.error(e);
    throw new Error(e).message;
  }
};
