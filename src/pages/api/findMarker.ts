import clientPromise from "@lib/mongodb";

export default async (req, res) => {
  try {
    const { searchParam, mapSlug } = req.query;
    const client = await clientPromise;
    const db = client.db("ritcher-map");

    const markers = await db
      .collection("markers")
      .find({
        $and: [
          {
            $or: [
              { markerName: { $regex: searchParam } },
              { descriptions: { $regex: searchParam } },
            ],
          },
          {
            mapSlug: mapSlug,
          },
        ],
      })
      .collation({ locale: "en", strength: 5 })
      .toArray();

    res.json(markers);
  } catch (e) {
    console.error(e);
  }
};
