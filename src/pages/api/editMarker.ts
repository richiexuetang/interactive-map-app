import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("ritcher-map");
    const { id } = req.query;
    const { markerName, descriptions, lat, lng } = req.body;

    const marker = await db.collection("markers").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          descriptions: descriptions,
          markerName: markerName,
          lat: lat,
          lng: lng,
          coordinate: [lat, lng],
        },
      }
    );

    res.json(marker);
  } catch (e) {
    console.error(e);
    throw new Error(e).message;
  }
};
