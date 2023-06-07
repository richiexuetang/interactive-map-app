import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("ritcher-map");
    const { id } = req.query;

    const marker = await db.collection("markers").deleteOne({
      _id: new ObjectId(id)
    });

    res.json(marker);
  } catch (e) {
    console.error(e);
    throw new Error(e).message;
  }
};
