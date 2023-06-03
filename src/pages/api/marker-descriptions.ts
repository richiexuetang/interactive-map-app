import clientPromise from "@lib/mongodb";

export default async (req, res) => {
  try {
    const { area } = req.query;
    const client = await clientPromise;
    const db = client.db("test");

    const projection = { area: 0, category: 0, title: 0, coord: 0, type: 0};

    const descriptions = await db
      .collection("markers")
      .find({ area: area })
      .project(projection)
      .toArray();

    res.json(descriptions);
  } catch (e) {
    console.error(e);
  }
};
