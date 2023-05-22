import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const { title, category, area, descriptions, coord, type } = req.body;

    const marker = await db.collection("markers").insertOne({
      area: area,
      category: category,
      coord: coord,
      descriptions: descriptions,
      title: title,
      type: type,
    });

    res.json(marker);
  } catch (e) {
    console.error(e);
    throw new Error(e).message;
  }
};
