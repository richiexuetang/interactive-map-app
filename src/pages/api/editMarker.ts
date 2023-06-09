import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("ritcher-map");
    const { id } = req.query;
    const { markerName, description, lat, lng, markerTypeId, categoryId } =
      req.body;

    const marker = await db.collection("markers").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          description: description,
          markerName: markerName,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          coordinate: [parseFloat(lat), parseFloat(lng)],
          markerTypeId: parseInt(markerTypeId),
          categoryId: parseInt(categoryId),
        },
      }
    );

    res.json(marker);
  } catch (e) {
    console.error(e);
    throw new Error(e).message;
  }
};
