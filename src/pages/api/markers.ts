import clientPromise from "@lib/mongodb";

export default async (req, res) => {
    try {
        const {area} = req.query;
        const client = await clientPromise;
        const db = client.db("test");

        const markers = await db
            .collection("markers")
            .find({area: area})
            .sort({ coord: -1 })
            .toArray();

        res.json(markers);
    } catch (e) {
        console.error(e);
    }
}