import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const { id } = req.query;
    const { title, descriptions, category, type } = req.body;

    const marker = await db.collection("markers").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          descriptions: descriptions,
          title: title,
          category: category,
          type: type
        },
      }
    );

    res.json(marker);
  } catch (e) {
    console.error(e);
    throw new Error(e).message;
  }
};
