import clientPromise from "@lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
    try {
        const {id} = req.query;
        const client = await clientPromise;
        const db = client.db("test");

        const details = await db
            .collection("markers")
            .findOne({_id: new ObjectId(id)});

        const {descriptions, type} = details;
        
        res.json({descriptions, type});
    } catch (e) {
        console.error(e);
    }
}