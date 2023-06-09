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
      descriptions,
      coordinate,
      markerTypeId,
    } = req.body;

    const marker = await db.collection("markers").insertOne({
      markerName: markerName,
      categoryId: categoryId,
      coordinate: coordinate,
      descriptions: descriptions,
      markerTypeId: markerTypeId,
      mapSlug: mapSlug, 
      gameSlug: gameSlug
    });

    res.json(marker);
  } catch (e) {
    console.error(e);
    throw new Error(e).message;
  }
};
