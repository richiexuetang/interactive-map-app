import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  try {
    const { id } = req.query;
    const client = await clientPromise;
    const db = client.db("ritcher-map");

    const marker = await db
      .collection("markers")
      .findOne(
        { _id: new ObjectId(id) },
        { categoryId: 1, markerName: 1, description: 1, lat: 1, lng: 1, markerTypeId: 1, __v: 0 }
      );

    res.json(marker);
  } catch (e) {
    console.error(e);
  }
};
