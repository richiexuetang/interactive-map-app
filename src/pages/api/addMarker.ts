import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("ritcher-map");
    const {
      markerName,
      categoryId,
      mapSlug,
      gameSlug,
      description,
      coordinate,
      markerTypeId,
    } = req.body;

    const marker = await db.collection("markers").insertOne({
      markerName,
      categoryId,
      coordinate: coordinate,
      description: description,
      markerTypeId,
      mapSlug: mapSlug,
      gameSlug: gameSlug,
      lat: coordinate[0],
      lng: coordinate[1]
    });

    res.json(marker);
  } catch (e) {
    console.error(e);
    throw new Error(e).message;
  }
};
