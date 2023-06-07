import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
    try {
        const {id} = req.query;
        const client = await clientPromise;
        const db = client.db("ritcher-map");

        const details = await db
            .collection("markers")
            .findOne({_id: new ObjectId(id)});

        const {descriptions} = details;
        
        res.json({descriptions});
    } catch (e) {
        console.error(e);
    }
}